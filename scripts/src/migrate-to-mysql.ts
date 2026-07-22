/**
 * One-time PostgreSQL → MySQL data migration tool.
 *
 * ENVIRONMENT VARIABLES
 * ─────────────────────
 * Source (PostgreSQL / Supabase):
 *   SUPABASE_DATABASE_URL   — required; read-only Supabase Transaction Pooler URL
 *
 * Destination (MySQL / Hostinger):
 *   MYSQL_MIGRATION_DATABASE_URL — required; uses the REMOTE Hostinger MySQL
 *     hostname so this script can run from Replit or a local computer.
 *     (NOT MYSQL_DATABASE_URL — that one uses Hostinger's internal localhost
 *      host and is only reachable from within Hostinger's server.)
 *
 * FLAGS
 * ─────
 *   --execute   Write to MySQL. Omit for a dry-run (default; prints plan only).
 *
 * SAFETY
 * ──────
 *   - Never modifies or deletes source PostgreSQL data.
 *   - Does NOT use INSERT IGNORE. Duplicate primary-key rows are caught by error
 *     code (ER_DUP_ENTRY / 1062) and counted as intentional skips. All other
 *     errors (schema, encoding, nullability, FK) propagate and abort the migration.
 *   - Processes tables in dependency-safe order.
 *   - Inserts source IDs explicitly so PRIMARY KEY values are preserved.
 *   - After all inserts, AUTO_INCREMENT is reset to max(id)+1 on each table so
 *     new rows created on Hostinger never collide with migrated rows.
 *   - Credentials are never printed.
 *   - Safe to re-run — duplicate rows are skipped, not duplicated.
 *
 * USAGE
 * ─────
 *   # Dry run (no MySQL connection required for source check):
 *   SUPABASE_DATABASE_URL='postgresql://...' MYSQL_MIGRATION_DATABASE_URL='mysql://...' \
 *     pnpm --filter @workspace/scripts run migrate-to-mysql
 *
 *   # Execute:
 *   SUPABASE_DATABASE_URL='postgresql://...' MYSQL_MIGRATION_DATABASE_URL='mysql://...' \
 *     pnpm --filter @workspace/scripts run migrate-to-mysql -- --execute
 */

import pg from "pg";
import mysql from "mysql2/promise";

// ── Environment variables ──────────────────────────────────────────────────

const pgUrl = process.env.SUPABASE_DATABASE_URL;
const mysqlUrl = process.env.MYSQL_MIGRATION_DATABASE_URL;
const dryRun = !process.argv.includes("--execute");

if (!pgUrl) {
  console.error(
    "❌  SUPABASE_DATABASE_URL must be set (Supabase Transaction Pooler URL).\n" +
      "   This variable is the read-only source. DATABASE_URL is not accepted\n" +
      "   here to avoid accidentally migrating from the wrong database.",
  );
  process.exit(1);
}

if (!mysqlUrl) {
  console.error(
    "❌  MYSQL_MIGRATION_DATABASE_URL must be set.\n" +
      "   Use the REMOTE Hostinger MySQL hostname (not localhost) so this\n" +
      "   script can connect from Replit or a local computer.\n" +
      "   Format: mysql://DB_USER:PASSWORD@HOSTINGER_REMOTE_HOST:3306/DATABASE",
  );
  process.exit(1);
}

// ── Types ──────────────────────────────────────────────────────────────────

interface TableStats {
  table: string;
  source_rows: number;
  dest_before: number;
  attempted: number;
  inserted: number;
  skipped_dup: number;
  dest_after: number;
  mismatch: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function redact(url: string): string {
  try {
    const u = new URL(url);
    u.password = u.password ? "***" : "";
    u.username = u.username ? "***" : "";
    return u.toString();
  } catch {
    return "[invalid url]";
  }
}

/** PostgreSQL boolean → MySQL TINYINT(1) */
function fmtBool(v: boolean | null | undefined): number {
  return v ? 1 : 0;
}

/** Date/string → MySQL DATETIME string "YYYY-MM-DD HH:MM:SS" (UTC) */
function fmtDate(v: Date | string | null | undefined): string | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

/** null/undefined → null */
function fmtStr(v: string | null | undefined): string | null {
  return v ?? null;
}

/**
 * Run a single INSERT (without IGNORE). Returns true if inserted, false if
 * duplicate primary key (ER_DUP_ENTRY / MySQL error 1062). Re-throws all
 * other errors so schema, encoding, nullability and FK errors are visible.
 */
async function tryInsert(
  pool: mysql.Pool,
  sql: string,
  values: unknown[],
): Promise<"inserted" | "dup"> {
  try {
    const [result] = await pool.query(sql, values);
    const header = result as mysql.ResultSetHeader;
    return header.affectedRows > 0 ? "inserted" : "dup";
  } catch (err: any) {
    // 1062 = ER_DUP_ENTRY — intentional duplicate; all other errors propagate
    if (err.errno === 1062 || err.code === "ER_DUP_ENTRY") {
      return "dup";
    }
    throw err;
  }
}

async function countRows(pool: mysql.Pool, table: string): Promise<number> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS n FROM \`${table}\``,
  );
  return Number((rows as any)[0].n);
}

/**
 * Reset AUTO_INCREMENT to max(id)+1 so future inserts never collide with
 * migrated rows. This is a no-op if the table is empty.
 */
async function resetAutoIncrement(pool: mysql.Pool, table: string): Promise<void> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT COALESCE(MAX(id), 0) + 1 AS next FROM \`${table}\``,
  );
  const next = Number((rows as any)[0].next);
  if (next > 1) {
    await pool.query(`ALTER TABLE \`${table}\` AUTO_INCREMENT = ?`, [next]);
  }
}

function printStats(stats: TableStats): void {
  const ok = !stats.mismatch ? "✅" : "⚠️  MISMATCH";
  console.log(`   source_rows  : ${stats.source_rows}`);
  console.log(`   dest_before  : ${stats.dest_before}`);
  console.log(`   attempted    : ${stats.attempted}`);
  console.log(`   inserted     : ${stats.inserted}`);
  console.log(`   skipped_dup  : ${stats.skipped_dup}`);
  console.log(`   dest_after   : ${stats.dest_after}`);
  console.log(`   result       : ${ok}`);
  if (stats.mismatch) {
    console.warn(
      `   ⚠️  Expected dest_after = dest_before + inserted ` +
        `(${stats.dest_before} + ${stats.inserted} = ${stats.dest_before + stats.inserted}), ` +
        `got ${stats.dest_after}`,
    );
  }
}

// ── Table migrations ────────────────────────────────────────────────────────

async function migrateAdminUsers(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<TableStats> {
  console.log("\n── admin_users");

  const { rows } = await pgPool.query<{
    id: number;
    username: string;
    password_hash: string;
    created_at: Date;
  }>("SELECT * FROM admin_users ORDER BY id");

  const dest_before = dryRun ? 0 : await countRows(myPool, "admin_users");

  const stats: TableStats = {
    table: "admin_users",
    source_rows: rows.length,
    dest_before,
    attempted: rows.length,
    inserted: 0,
    skipped_dup: 0,
    dest_after: 0,
    mismatch: false,
  };

  for (const row of rows) {
    const sql =
      "INSERT INTO admin_users (id, username, password_hash, created_at) " +
      "VALUES (?, ?, ?, ?)";
    const values = [row.id, row.username, row.password_hash, fmtDate(row.created_at)];

    if (dryRun) {
      console.log(`   [dry] id=${row.id} username=*** (redacted) created_at=${fmtDate(row.created_at)}`);
    } else {
      const outcome = await tryInsert(myPool, sql, values);
      if (outcome === "inserted") stats.inserted++;
      else stats.skipped_dup++;
    }
  }

  if (!dryRun) {
    await resetAutoIncrement(myPool, "admin_users");
    stats.dest_after = await countRows(myPool, "admin_users");
    stats.mismatch = stats.dest_after !== stats.dest_before + stats.inserted;
    printStats(stats);
  } else {
    console.log(`   [dry] source_rows=${stats.source_rows} (MySQL not connected in dry-run)`);
  }

  return stats;
}

async function migrateSiteContent(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<TableStats> {
  console.log("\n── site_content");

  const { rows } = await pgPool.query<{
    id: number;
    section: string;
    key: string;
    value: string;
    label: string;
    updated_at: Date;
  }>("SELECT * FROM site_content ORDER BY id");

  const dest_before = dryRun ? 0 : await countRows(myPool, "site_content");

  const stats: TableStats = {
    table: "site_content",
    source_rows: rows.length,
    dest_before,
    attempted: rows.length,
    inserted: 0,
    skipped_dup: 0,
    dest_after: 0,
    mismatch: false,
  };

  for (const row of rows) {
    const sql =
      "INSERT INTO site_content (id, section, `key`, value, label, updated_at) " +
      "VALUES (?, ?, ?, ?, ?, ?)";
    const values = [row.id, row.section, row.key, row.value, row.label, fmtDate(row.updated_at)];

    if (dryRun) {
      console.log(`   [dry] id=${row.id} section=${row.section} key=${row.key}`);
    } else {
      const outcome = await tryInsert(myPool, sql, values);
      if (outcome === "inserted") stats.inserted++;
      else stats.skipped_dup++;
    }
  }

  if (!dryRun) {
    await resetAutoIncrement(myPool, "site_content");
    stats.dest_after = await countRows(myPool, "site_content");
    stats.mismatch = stats.dest_after !== stats.dest_before + stats.inserted;
    printStats(stats);
  } else {
    console.log(`   [dry] source_rows=${stats.source_rows}`);
  }

  return stats;
}

async function migrateSiteImages(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<TableStats> {
  console.log("\n── site_images");

  const { rows } = await pgPool.query<{
    id: number;
    key: string;
    url: string;
    label: string;
    updated_at: Date;
  }>("SELECT * FROM site_images ORDER BY id");

  const dest_before = dryRun ? 0 : await countRows(myPool, "site_images");

  const stats: TableStats = {
    table: "site_images",
    source_rows: rows.length,
    dest_before,
    attempted: rows.length,
    inserted: 0,
    skipped_dup: 0,
    dest_after: 0,
    mismatch: false,
  };

  for (const row of rows) {
    const sql =
      "INSERT INTO site_images (id, `key`, url, label, updated_at) " +
      "VALUES (?, ?, ?, ?, ?)";
    const values = [row.id, row.key, row.url, row.label, fmtDate(row.updated_at)];

    if (dryRun) {
      console.log(`   [dry] id=${row.id} key=${row.key} url=${row.url}`);
    } else {
      const outcome = await tryInsert(myPool, sql, values);
      if (outcome === "inserted") stats.inserted++;
      else stats.skipped_dup++;
    }
  }

  if (!dryRun) {
    await resetAutoIncrement(myPool, "site_images");
    stats.dest_after = await countRows(myPool, "site_images");
    stats.mismatch = stats.dest_after !== stats.dest_before + stats.inserted;
    printStats(stats);
  } else {
    console.log(`   [dry] source_rows=${stats.source_rows}`);
  }

  return stats;
}

async function migrateContactSubmissions(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<TableStats> {
  console.log("\n── contact_submissions");

  const { rows } = await pgPool.query<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    position: string | null;
    company_name: string;
    message: string;
    lang: string;
    consent_given: boolean;
    created_at: Date;
  }>("SELECT * FROM contact_submissions ORDER BY id");

  const dest_before = dryRun ? 0 : await countRows(myPool, "contact_submissions");

  const stats: TableStats = {
    table: "contact_submissions",
    source_rows: rows.length,
    dest_before,
    attempted: rows.length,
    inserted: 0,
    skipped_dup: 0,
    dest_after: 0,
    mismatch: false,
  };

  for (const row of rows) {
    const sql =
      "INSERT INTO contact_submissions " +
      "(id, first_name, last_name, email, phone, position, company_name, " +
      " message, lang, consent_given, created_at) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      row.id,
      row.first_name,
      row.last_name,
      row.email,
      fmtStr(row.phone),
      fmtStr(row.position),
      row.company_name,
      row.message,
      row.lang,
      fmtBool(row.consent_given),
      fmtDate(row.created_at),
    ];

    if (dryRun) {
      console.log(
        `   [dry] id=${row.id} email=*** (redacted) lang=${row.lang} consent=${fmtBool(row.consent_given)}`,
      );
    } else {
      const outcome = await tryInsert(myPool, sql, values);
      if (outcome === "inserted") stats.inserted++;
      else stats.skipped_dup++;
    }
  }

  if (!dryRun) {
    await resetAutoIncrement(myPool, "contact_submissions");
    stats.dest_after = await countRows(myPool, "contact_submissions");
    stats.mismatch = stats.dest_after !== stats.dest_before + stats.inserted;
    printStats(stats);
  } else {
    console.log(`   [dry] source_rows=${stats.source_rows}`);
  }

  return stats;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔌  Source (PG):      ${redact(pgUrl!)}`);
  if (dryRun) {
    console.log("🔌  Destination:     [not connected in dry-run mode]");
  } else {
    console.log(`🔌  Destination (MySQL): ${redact(mysqlUrl!)}`);
  }
  console.log(`🧪  Mode:            ${dryRun ? "DRY RUN (pass --execute to write)" : "⚡ EXECUTE"}\n`);

  const pgPool = new pg.Pool({ connectionString: pgUrl });

  if (dryRun) {
    // In dry-run mode, only connect to PG (no MySQL needed)
    try {
      await migrateAdminUsers(pgPool, null as any);
      await migrateSiteContent(pgPool, null as any);
      await migrateSiteImages(pgPool, null as any);
      await migrateContactSubmissions(pgPool, null as any);
      console.log("\n✅  Dry run complete. Run with --execute to write to MySQL.\n");
    } finally {
      await pgPool.end();
    }
    return;
  }

  // Execute mode — connect to both DBs
  // Tables run sequentially in dependency-safe order for predictable output.
  const myPool = await mysql.createPool(mysqlUrl!);
  try {
    await migrateAdminUsers(pgPool, myPool);
    await migrateSiteContent(pgPool, myPool);
    await migrateSiteImages(pgPool, myPool);
    await migrateContactSubmissions(pgPool, myPool);

    console.log("\n✅  Migration complete.\n");
  } finally {
    await pgPool.end();
    await myPool.end();
  }
}

main().catch((err) => {
  console.error("\n❌  Migration failed:", err.message);
  if (err.code) console.error("    Error code:", err.code);
  process.exit(1);
});

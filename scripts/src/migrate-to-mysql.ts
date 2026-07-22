/**
 * One-time PostgreSQL → MySQL data migration tool.
 *
 * Usage:
 *   # Dry run (default — prints what would be inserted):
 *   SUPABASE_DATABASE_URL=postgres://... MYSQL_DATABASE_URL=mysql://... \
 *     pnpm --filter @workspace/scripts run migrate-to-mysql
 *
 *   # Execute (actually writes to MySQL):
 *   ... same env vars ... pnpm run migrate-to-mysql -- --execute
 *
 * Safety guarantees:
 *   - Never modifies or deletes source PostgreSQL data.
 *   - Uses INSERT IGNORE (skips rows already present by primary key).
 *   - Safe to re-run multiple times.
 *   - Credentials are never printed.
 *   - Processes tables in dependency-safe order.
 */

import pg from "pg";
import mysql from "mysql2/promise";

// ── Connection strings ─────────────────────────────────────────────────────

const pgUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
const mysqlUrl = process.env.MYSQL_DATABASE_URL;
const dryRun = !process.argv.includes("--execute");

if (!pgUrl) {
  console.error(
    "❌  SUPABASE_DATABASE_URL (or DATABASE_URL) must be set for source DB.",
  );
  process.exit(1);
}
if (!mysqlUrl) {
  console.error("❌  MYSQL_DATABASE_URL must be set for destination DB.");
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function redact(url: string): string {
  try {
    const u = new URL(url);
    u.password = "***";
    u.username = u.username ? "***" : "";
    return u.toString();
  } catch {
    return "[invalid url]";
  }
}

function fmtBool(v: boolean | null | undefined): number {
  return v ? 1 : 0;
}

function fmtDate(v: Date | string | null | undefined): string | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  // MySQL DATETIME format: "YYYY-MM-DD HH:MM:SS"
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function fmtStr(v: string | null | undefined): string | null {
  return v ?? null;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔌  Source:      ${redact(pgUrl!)}`);
  console.log(`🔌  Destination: ${redact(mysqlUrl!)}`);
  console.log(`🧪  Mode:        ${dryRun ? "DRY RUN (pass --execute to write)" : "⚡ EXECUTE"}\n`);

  const pgPool = new pg.Pool({ connectionString: pgUrl });
  const myPool = await mysql.createPool(mysqlUrl!);

  try {
    // Tables in dependency-safe order (no FK relationships, but logical order).
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

// ── Table migrations ───────────────────────────────────────────────────────

async function migrateAdminUsers(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<void> {
  console.log("── admin_users");
  const { rows } = await pgPool.query<{
    id: number;
    username: string;
    password_hash: string;
    created_at: Date;
  }>("SELECT * FROM admin_users ORDER BY id");

  console.log(`   Source rows: ${rows.length}`);

  const [destRows] = await myPool.query<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM admin_users",
  );
  console.log(`   Dest rows (before): ${(destRows as any)[0].n}`);

  let inserted = 0;
  for (const row of rows) {
    const sql =
      "INSERT IGNORE INTO admin_users (id, username, password_hash, created_at) " +
      "VALUES (?, ?, ?, ?)";
    const values = [
      row.id,
      row.username,
      row.password_hash,
      fmtDate(row.created_at),
    ];

    if (dryRun) {
      console.log(`   [dry] id=${row.id} username=*** (redacted)`);
    } else {
      const [result] = await myPool.query(sql, values);
      if ((result as mysql.ResultSetHeader).affectedRows > 0) inserted++;
    }
  }

  if (!dryRun) {
    const [after] = await myPool.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM admin_users",
    );
    console.log(
      `   Inserted: ${inserted}  Dest rows (after): ${(after as any)[0].n}`,
    );
  }
}

async function migrateSiteContent(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<void> {
  console.log("── site_content");
  const { rows } = await pgPool.query<{
    id: number;
    section: string;
    key: string;
    value: string;
    label: string;
    updated_at: Date;
  }>("SELECT * FROM site_content ORDER BY id");

  console.log(`   Source rows: ${rows.length}`);

  const [destRows] = await myPool.query<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM site_content",
  );
  console.log(`   Dest rows (before): ${(destRows as any)[0].n}`);

  let inserted = 0;
  for (const row of rows) {
    const sql =
      "INSERT IGNORE INTO site_content (id, section, `key`, value, label, updated_at) " +
      "VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      row.id,
      row.section,
      row.key,
      row.value,
      row.label,
      fmtDate(row.updated_at),
    ];

    if (dryRun) {
      console.log(`   [dry] id=${row.id} section=${row.section} key=${row.key}`);
    } else {
      const [result] = await myPool.query(sql, values);
      if ((result as mysql.ResultSetHeader).affectedRows > 0) inserted++;
    }
  }

  if (!dryRun) {
    const [after] = await myPool.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM site_content",
    );
    console.log(
      `   Inserted: ${inserted}  Dest rows (after): ${(after as any)[0].n}`,
    );
  }
}

async function migrateSiteImages(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<void> {
  console.log("── site_images");
  const { rows } = await pgPool.query<{
    id: number;
    key: string;
    url: string;
    label: string;
    updated_at: Date;
  }>("SELECT * FROM site_images ORDER BY id");

  console.log(`   Source rows: ${rows.length}`);

  const [destRows] = await myPool.query<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM site_images",
  );
  console.log(`   Dest rows (before): ${(destRows as any)[0].n}`);

  let inserted = 0;
  for (const row of rows) {
    const sql =
      "INSERT IGNORE INTO site_images (id, `key`, url, label, updated_at) " +
      "VALUES (?, ?, ?, ?, ?)";
    const values = [row.id, row.key, row.url, row.label, fmtDate(row.updated_at)];

    if (dryRun) {
      console.log(`   [dry] id=${row.id} key=${row.key}`);
    } else {
      const [result] = await myPool.query(sql, values);
      if ((result as mysql.ResultSetHeader).affectedRows > 0) inserted++;
    }
  }

  if (!dryRun) {
    const [after] = await myPool.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM site_images",
    );
    console.log(
      `   Inserted: ${inserted}  Dest rows (after): ${(after as any)[0].n}`,
    );
  }
}

async function migrateContactSubmissions(
  pgPool: pg.Pool,
  myPool: mysql.Pool,
): Promise<void> {
  console.log("── contact_submissions");
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

  console.log(`   Source rows: ${rows.length}`);

  const [destRows] = await myPool.query<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM contact_submissions",
  );
  console.log(`   Dest rows (before): ${(destRows as any)[0].n}`);

  let inserted = 0;
  for (const row of rows) {
    const sql =
      "INSERT IGNORE INTO contact_submissions " +
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
        `   [dry] id=${row.id} email=*** (redacted) lang=${row.lang}`,
      );
    } else {
      const [result] = await myPool.query(sql, values);
      if ((result as mysql.ResultSetHeader).affectedRows > 0) inserted++;
    }
  }

  if (!dryRun) {
    const [after] = await myPool.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM contact_submissions",
    );
    console.log(
      `   Inserted: ${inserted}  Dest rows (after): ${(after as any)[0].n}`,
    );
  }
}

main().catch((err) => {
  console.error("❌  Migration failed:", err.message);
  process.exit(1);
});

/**
 * Database adapter — selects PostgreSQL (Replit) or MySQL (Hostinger) at
 * runtime based on which environment variable is set.
 *
 * Detection:
 *   MYSQL_DATABASE_URL set  → @workspace/db-mysql  (mysql2 driver, Hostinger)
 *   Otherwise               → @workspace/db         (pg driver, Replit / Supabase)
 *
 * Both packages are bundled by esbuild but only the selected module's factory
 * executes at runtime, so only one DB connection is ever established.
 *
 * Top-level await is valid here: this is an ES module and Node.js 22+ supports
 * it. The importer (routes) receives resolved bindings after this module settles.
 */

const useMysql = Boolean(process.env.MYSQL_DATABASE_URL);

// Dynamic import: esbuild inlines both modules but defers each factory until
// the import() expression is evaluated — so only one branch runs.
const _mod = await (useMysql
  ? import("@workspace/db-mysql")
  : import("@workspace/db"));

// Cast to any: the union of PgDatabase | MySql2Database has incompatible method
// signatures for TypeScript but works correctly at runtime since only one branch
// is ever active. All table arguments are also cast to any below.
export const db = _mod.db as any;
export const adminUsersTable = _mod.adminUsersTable as any;
export const siteContentTable = _mod.siteContentTable as any;
export const contactSubmissionsTable = _mod.contactSubmissionsTable as any;
export const siteImagesTable = _mod.siteImagesTable as any;

/** True when the server is running in MySQL (Hostinger) mode. */
export const isMysql = useMysql;

import { defineConfig } from "drizzle-kit";

// Accept either the internal (Hostinger-local) or external (remote) URL so
// drizzle-kit can be run both from within Hostinger and from a local machine.
const url =
  process.env.MYSQL_DATABASE_URL ?? process.env.MYSQL_MIGRATION_DATABASE_URL;

if (!url) {
  throw new Error(
    "Set MYSQL_DATABASE_URL (internal Hostinger host) or " +
      "MYSQL_MIGRATION_DATABASE_URL (remote Hostinger host) for drizzle-kit operations.",
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "mysql",
  dbCredentials: { url },
  out: "./migrations",
});

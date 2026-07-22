import { defineConfig } from "drizzle-kit";
import path from "path";

// SUPABASE_DATABASE_URL takes precedence; DATABASE_URL is the fallback.
const url = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "SUPABASE_DATABASE_URL (or DATABASE_URL as fallback) must be set",
  );
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: { url },
});

import { defineConfig } from "drizzle-kit";

const url = process.env.MYSQL_DATABASE_URL;
if (!url) {
  throw new Error("MYSQL_DATABASE_URL must be set for MySQL migrations");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "mysql",
  dbCredentials: { url },
  out: "./migrations",
});

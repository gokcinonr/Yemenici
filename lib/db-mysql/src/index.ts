import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// This module is only loaded when MYSQL_DATABASE_URL is set (via dynamic import
// in artifacts/api-server/src/lib/database.ts). Throws fast if misconfigured.
const connectionString = process.env.MYSQL_DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "MYSQL_DATABASE_URL must be set for MySQL mode. " +
      "Format: mysql://USER:PASSWORD@HOST:3306/DATABASE",
  );
}

// Append charset and timezone to the connection URI so all text is transmitted
// as utf8mb4 (full Unicode including emoji and all Turkish characters) and all
// DATETIME values are stored and retrieved as UTC.
const url = new URL(connectionString);
if (!url.searchParams.has("charset")) url.searchParams.set("charset", "utf8mb4");
if (!url.searchParams.has("timezone")) url.searchParams.set("timezone", "+00:00");

export const pool = mysql.createPool(url.toString());
export const db = drizzle(pool, { schema, mode: "default" });

export * from "./schema";

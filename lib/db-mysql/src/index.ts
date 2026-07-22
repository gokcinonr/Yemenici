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

export const pool = mysql.createPool(connectionString);
export const db = drizzle(pool, { schema, mode: "default" });

export * from "./schema";

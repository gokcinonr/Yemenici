import app from "./app";
import { logger } from "./lib/logger";
import bcrypt from "bcryptjs";
// Import from the DB adapter so startup validation works on both PG and MySQL.
import { db, adminUsersTable } from "./lib/database";
import { validateAndPrepareUploadRoot } from "./lib/fileStorage";

// ── PORT resolution ───────────────────────────────────────────────────────────
// Hostinger injects PORT automatically. Default to 3000 for local development.
const rawPort = process.env["PORT"];
const port = rawPort !== undefined && rawPort !== "" ? Number(rawPort) : 3000;

if (!rawPort) {
  logger.warn("PORT env var not set — defaulting to 3000");
}

if (Number.isNaN(port) || port <= 0 || !Number.isInteger(port)) {
  throw new Error(
    `Invalid PORT value: "${rawPort}". PORT must be a positive integer (e.g. 3000).`,
  );
}

// ── UPLOAD_ROOT startup validation ────────────────────────────────────────────
// Validate absolute path, create uploads directory, and test writability before
// accepting any requests. Fails fast with a clear error message if misconfigured.
if (process.env.UPLOAD_ROOT) {
  await validateAndPrepareUploadRoot();
  logger.info({ uploadRoot: process.env.UPLOAD_ROOT }, "Filesystem storage ready");
}

// ── Admin user seeding ────────────────────────────────────────────────────────
async function seedAdminUser() {
  try {
    const existing = await db.select().from(adminUsersTable).limit(1);
    if (existing.length === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      await db.insert(adminUsersTable).values({
        username: "admin",
        passwordHash,
      });
      logger.info("Default admin user created");
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed admin user");
  }
}

seedAdminUser().then(() => {
  // Bind explicitly to 0.0.0.0 so the server accepts connections on all interfaces.
  // This is required on Hostinger (and most managed platforms) which routes traffic
  // through a proxy — binding to 127.0.0.1 only would make the server unreachable.
  const server = app.listen(port, "0.0.0.0", () => {
    logger.info(
      {
        port,
        host: "0.0.0.0",
        db: process.env.MYSQL_DATABASE_URL ? "mysql" : "postgres",
        storage: process.env.UPLOAD_ROOT ? "filesystem" : "gcs",
      },
      "Server listening",
    );
  });

  server.on("error", (err: Error) => {
    logger.error({ err }, "Error binding to port");
    process.exit(1);
  });
});

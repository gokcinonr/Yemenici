import app from "./app";
import { logger } from "./lib/logger";
import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

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
  app.listen(port, (err?: Error) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
});

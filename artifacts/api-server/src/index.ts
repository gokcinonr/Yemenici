import app from "./app";
import { logger } from "./lib/logger";
import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";

// Hostinger may provide PORT, or use a standard default.
// Fall back to 3000 so the server always starts.
const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : 3000;

if (Number.isNaN(port) || port <= 0) {
  logger.error({ rawPort }, "Invalid PORT value — defaulting to 3000");
}

const listenPort = Number.isNaN(port) || port <= 0 ? 3000 : port;

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
    logger.error({ err }, "Failed to seed admin user — continuing startup");
  }
}

seedAdminUser().then(() => {
  app.listen(listenPort, "0.0.0.0", (err?: Error) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port: listenPort }, "Server listening");
  });
});

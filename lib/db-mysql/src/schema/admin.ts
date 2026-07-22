import { mysqlTable, int, varchar, text, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminUsersTable = mysqlTable("admin_users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertAdminUserSchema = createInsertSchema(adminUsersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsersTable.$inferSelect;

export const siteContentTable = mysqlTable("site_content", {
  id: int("id").primaryKey().autoincrement(),
  section: varchar("section", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertSiteContentSchema = createInsertSchema(siteContentTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContentTable.$inferSelect;

export const siteImagesTable = mysqlTable("site_images", {
  id: int("id").primaryKey().autoincrement(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  url: text("url").notNull(),
  label: text("label").notNull(),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertSiteImageSchema = createInsertSchema(siteImagesTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertSiteImage = z.infer<typeof insertSiteImageSchema>;
export type SiteImage = typeof siteImagesTable.$inferSelect;

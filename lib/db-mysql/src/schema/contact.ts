import { mysqlTable, int, varchar, text, boolean, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactSubmissionsTable = mysqlTable("contact_submissions", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  position: varchar("position", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  message: text("message").notNull(),
  lang: varchar("lang", { length: 10 }).notNull().default("en"),
  consentGiven: boolean("consent_given").notNull().default(true),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertContactSchema = createInsertSchema(contactSubmissionsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;

import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  college: text("college").notNull().default(""),
  course: text("course").notNull().default(""),
  branch: text("branch").notNull().default(""),
  year: integer("year").notNull().default(1),
  hostel: text("hostel"),
  interests: text("interests").array().notNull().default([]),
  skills: text("skills").array().notNull().default([]),
  isVerified: boolean("is_verified").notNull().default(false),
  isFirst100: boolean("is_first_100").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;

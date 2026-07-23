import { pgTable, text, serial, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roleEnum = pgEnum("role", ["student", "moderator", "admin", "super_admin"]);
export const verificationStatusEnum = pgEnum("verification_status", ["unverified", "pending", "approved", "rejected"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("student"),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("unverified"),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailOtp: text("email_otp"),
  otpExpiresAt: timestamp("otp_expires_at"),
  isFirst100: boolean("is_first_100").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
  avatarUrl: text("avatar_url"),
  jwtToken: text("jwt_token"),
  refreshToken: text("refresh_token"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

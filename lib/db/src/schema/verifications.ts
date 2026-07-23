import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const verificationStatusDbEnum = pgEnum("verification_request_status", ["pending", "approved", "rejected"]);

export const verificationsTable = pgTable("verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  erpNumber: text("erp_number").notNull().unique(),
  collegeEmail: text("college_email"),
  idCardUrl: text("id_card_url"),
  status: verificationStatusDbEnum("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  reviewedBy: integer("reviewed_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertVerificationSchema = createInsertSchema(verificationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Verification = typeof verificationsTable.$inferSelect;

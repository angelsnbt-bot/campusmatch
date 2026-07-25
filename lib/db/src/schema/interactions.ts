import { pgTable, serial, integer, text, boolean, timestamp, pgEnum, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const connectionStatusEnum = pgEnum("connection_status", ["pending", "accepted", "rejected"]);

export const likesTable = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  targetUserId: integer("target_user_id").notNull(),
  mode: text("mode").notNull().default("dating"),
  isSuperLike: boolean("is_super_like").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  foreignKey({ columns: [t.userId], foreignColumns: [usersTable.id], name: "likes_user_id_fk" }),
  foreignKey({ columns: [t.targetUserId], foreignColumns: [usersTable.id], name: "likes_target_user_id_fk" }),
]);

export const matchesTable = pgTable("matches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  matchedUserId: integer("matched_user_id").notNull(),
  mode: text("mode").notNull().default("dating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  foreignKey({ columns: [t.userId], foreignColumns: [usersTable.id], name: "matches_user_id_fk" }),
  foreignKey({ columns: [t.matchedUserId], foreignColumns: [usersTable.id], name: "matches_matched_user_id_fk" }),
]);

export const connectionsTable = pgTable("connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  connectedUserId: integer("connected_user_id").notNull(),
  status: connectionStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  foreignKey({ columns: [t.userId], foreignColumns: [usersTable.id], name: "connections_user_id_fk" }),
  foreignKey({ columns: [t.connectedUserId], foreignColumns: [usersTable.id], name: "connections_connected_user_id_fk" }),
]);

export const insertLikeSchema = createInsertSchema(likesTable).omit({ id: true, createdAt: true });
export type InsertLike = z.infer<typeof insertLikeSchema>;

export const insertMatchSchema = createInsertSchema(matchesTable).omit({ id: true, createdAt: true });
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export const insertConnectionSchema = createInsertSchema(connectionsTable).omit({ id: true, createdAt: true });
export type InsertConnection = z.infer<typeof insertConnectionSchema>;

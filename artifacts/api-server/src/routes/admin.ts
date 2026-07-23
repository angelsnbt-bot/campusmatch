import { Router, type Response } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  verificationsTable,
  profilesTable,
  postsTable,
  eventsTable,
  matchesTable,
  auditLogsTable,
} from "@workspace/db";
import { eq, ilike, sql, desc, and, or, inArray } from "drizzle-orm";
import {
  ApproveVerificationParams,
  RejectVerificationParams,
  RejectVerificationBody,
  BanUserParams,
  BanUserBody,
} from "@workspace/api-zod";
import { type AuthenticatedRequest, requireAdmin, paramStr } from "../middlewares/auth";

function escapeLike(str: string): string {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

const router = Router();

async function logAudit(adminId: number, action: string, targetType: string, targetId: number | null, details: string | null) {
  await db.insert(auditLogsTable).values({ adminId, action, targetType, targetId: targetId ?? null, details: details ?? null });
}

router.get("/admin/verification-queue", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const queue = await db
    .select()
    .from(verificationsTable)
    .where(eq(verificationsTable.status, "pending"))
    .orderBy(verificationsTable.createdAt)
    .limit(100);

  const userIds = [...new Set(queue.map((v) => v.userId))];
  const users = userIds.length > 0
    ? await db.select().from(usersTable).where(inArray(usersTable.id, userIds))
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  const result = queue.map((v) => {
    const user = userMap.get(v.userId);
    return {
      id: v.id,
      userId: v.userId,
      userName: user?.name ?? "Unknown",
      userEmail: user?.email ?? "",
      erpNumber: v.erpNumber,
      idCardUrl: v.idCardUrl,
      status: v.status,
      createdAt: v.createdAt,
    };
  });
  res.json(result);
});

router.post("/admin/verification/:verificationId/approve", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const admin = req.user!;

  const parsed = ApproveVerificationParams.safeParse({ verificationId: parseInt(paramStr(req.params.verificationId)) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [verification] = await db
    .update(verificationsTable)
    .set({ status: "approved", reviewedBy: admin.id, updatedAt: new Date() })
    .where(and(eq(verificationsTable.id, parsed.data.verificationId), eq(verificationsTable.status, "pending")))
    .returning();

  if (!verification) {
    res.status(404).json({ error: "Verification not found or already processed" });
    return;
  }

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.verificationStatus, "approved"));
  const isFirst100 = (countResult?.count ?? 0) < 100;

  await db.update(usersTable).set({
    verificationStatus: "approved",
    isFirst100,
  }).where(eq(usersTable.id, verification.userId));

  await db.update(profilesTable).set({ isVerified: true, isFirst100 }).where(eq(profilesTable.userId, verification.userId));

  await logAudit(admin.id, "approve_verification", "verification", parsed.data.verificationId, `ERP: ${verification.erpNumber}`);

  res.json({ success: true });
});

router.post("/admin/verification/:verificationId/reject", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const admin = req.user!;

  const params = RejectVerificationParams.safeParse({ verificationId: parseInt(paramStr(req.params.verificationId)) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const body = RejectVerificationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [verification] = await db
    .update(verificationsTable)
    .set({ status: "rejected", rejectionReason: body.data.reason, reviewedBy: admin.id, updatedAt: new Date() })
    .where(eq(verificationsTable.id, params.data.verificationId))
    .returning();

  if (!verification) {
    res.status(404).json({ error: "Verification not found" });
    return;
  }

  await db.update(usersTable).set({ verificationStatus: "rejected" }).where(eq(usersTable.id, verification.userId));
  await logAudit(admin.id, "reject_verification", "verification", params.data.verificationId, body.data.reason);

  res.json({ success: true });
});

router.get("/admin/users", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { search, status } = req.query as { search?: string; status?: string };

  const conditions = [];
  if (search) {
    const safeSearch = escapeLike(search);
    conditions.push(or(ilike(usersTable.name, `%${safeSearch}%`), ilike(usersTable.email, `%${safeSearch}%`)));
  }
  if (status && status !== "null") {
    if (status === "banned") conditions.push(eq(usersTable.isBanned, true));
    else if (status === "pending_verification") conditions.push(eq(usersTable.verificationStatus, "pending"));
    else if (status === "active") conditions.push(and(eq(usersTable.isBanned, false), eq(usersTable.verificationStatus, "approved")));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let users;
  if (whereClause) {
    users = await db.select().from(usersTable).where(whereClause).orderBy(desc(usersTable.createdAt)).limit(200);
  } else {
    users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(200);
  }

  res.json(users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    verificationStatus: u.verificationStatus,
    isBanned: u.isBanned,
    createdAt: u.createdAt,
  })));
});

router.post("/admin/users/:userId/ban", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const admin = req.user!;

  const params = BanUserParams.safeParse({ userId: parseInt(paramStr(req.params.userId)) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const body = BanUserBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  if (params.data.userId === admin.id) {
    res.status(400).json({ error: "Cannot ban yourself" });
    return;
  }

  await db.update(usersTable).set({ isBanned: true, jwtToken: null }).where(eq(usersTable.id, params.data.userId));
  await logAudit(admin.id, "ban_user", "user", params.data.userId, body.data.reason);

  res.json({ success: true });
});

router.post("/admin/users/:userId/unban", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const params = BanUserParams.safeParse({ userId: parseInt(paramStr(req.params.userId)) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  await db.update(usersTable).set({ isBanned: false }).where(eq(usersTable.id, params.data.userId));
  await logAudit(req.user!.id, "unban_user", "user", params.data.userId, null);

  res.json({ success: true });
});

router.get("/admin/analytics", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const [totalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
  const [verifiedUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.verificationStatus, "approved"));
  const [pendingVerifications] = await db.select({ count: sql<number>`count(*)::int` }).from(verificationsTable).where(eq(verificationsTable.status, "pending"));
  const [totalPosts] = await db.select({ count: sql<number>`count(*)::int` }).from(postsTable);
  const [totalEvents] = await db.select({ count: sql<number>`count(*)::int` }).from(eventsTable);
  const [totalMatches] = await db.select({ count: sql<number>`count(*)::int` }).from(matchesTable);

  const dailySignups = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    const [dayCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(usersTable)
      .where(and(sql`${usersTable.createdAt} >= ${dayStart}`, sql`${usersTable.createdAt} <= ${dayEnd}`));
    dailySignups.push({
      date: dayStart.toISOString().split("T")[0],
      count: dayCount?.count ?? 0,
    });
  }

  res.json({
    totalUsers: totalUsers?.count ?? 0,
    verifiedUsers: verifiedUsers?.count ?? 0,
    pendingVerifications: pendingVerifications?.count ?? 0,
    totalPosts: totalPosts?.count ?? 0,
    totalEvents: totalEvents?.count ?? 0,
    totalMatches: totalMatches?.count ?? 0,
    dailySignups,
  });
});

router.get("/admin/audit-logs", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const logs = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt)).limit(100);
  const adminIds = [...new Set(logs.map((l) => l.adminId))];
  const admins = adminIds.length > 0
    ? await db.select().from(usersTable).where(inArray(usersTable.id, adminIds))
    : [];
  const adminMap = new Map(admins.map((a) => [a.id, a]));
  const result = logs.map((l) => ({
    ...l,
    adminName: adminMap.get(l.adminId)?.name ?? "Unknown",
  }));
  res.json(result);
});

export default router;

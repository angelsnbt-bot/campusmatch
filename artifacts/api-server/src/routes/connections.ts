import { Router, type Response } from "express";
import { db } from "@workspace/db";
import { profilesTable, connectionsTable } from "@workspace/db";
import { eq, or, and, inArray } from "drizzle-orm";
import { SendConnectionRequestBody, AcceptConnectionParams } from "@workspace/api-zod";
import { type AuthenticatedRequest, requireAuth, requireVerified, paramStr } from "../middlewares/auth";

const router = Router();

router.get("/connections", requireAuth, requireVerified, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const conns = await db
    .select()
    .from(connectionsTable)
    .where(and(or(eq(connectionsTable.userId, user.id), eq(connectionsTable.connectedUserId, user.id)), eq(connectionsTable.status, "accepted")));

  const otherIds = [...new Set(conns.map((c) => c.userId === user.id ? c.connectedUserId : c.userId))];
  const profiles = otherIds.length > 0
    ? await db.select().from(profilesTable).where(inArray(profilesTable.userId, otherIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.userId, p]));

  const result = conns.map((c) => {
    const otherId = c.userId === user.id ? c.connectedUserId : c.userId;
    const profile = profileMap.get(otherId);
    return { ...c, connectedProfile: profile ? { ...profile, matchScore: null } : null };
  });
  res.json(result);
});

router.post("/connections/request", requireAuth, requireVerified, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const parsed = SendConnectionRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.targetUserId === user.id) {
    res.status(400).json({ error: "Cannot connect with yourself" });
    return;
  }

  const [existingConn] = await db
    .select()
    .from(connectionsTable)
    .where(and(
      or(
        and(eq(connectionsTable.userId, user.id), eq(connectionsTable.connectedUserId, parsed.data.targetUserId)),
        and(eq(connectionsTable.userId, parsed.data.targetUserId), eq(connectionsTable.connectedUserId, user.id))
      )
    ))
    .limit(1);

  if (existingConn) {
    res.status(409).json({ error: "Connection already exists" });
    return;
  }

  const [conn] = await db.insert(connectionsTable).values({
    userId: user.id,
    connectedUserId: parsed.data.targetUserId,
    status: "pending",
  }).returning();
  if (!conn) {
    res.status(500).json({ error: "Failed to send request" });
    return;
  }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, parsed.data.targetUserId)).limit(1);
  res.status(201).json({ ...conn, connectedProfile: profile ? { ...profile, matchScore: null } : null });
});

router.post("/connections/:connectionId/accept", requireAuth, requireVerified, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const parsed = AcceptConnectionParams.safeParse({ connectionId: parseInt(paramStr(req.params.connectionId)) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [conn] = await db
    .update(connectionsTable)
    .set({ status: "accepted" })
    .where(and(eq(connectionsTable.id, parsed.data.connectionId), eq(connectionsTable.connectedUserId, user.id), eq(connectionsTable.status, "pending")))
    .returning();
  if (!conn) {
    res.status(404).json({ error: "Connection request not found" });
    return;
  }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, conn.userId)).limit(1);
  res.json({ ...conn, connectedProfile: profile ? { ...profile, matchScore: null } : null });
});

router.post("/connections/:connectionId/reject", requireAuth, requireVerified, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const parsed = AcceptConnectionParams.safeParse({ connectionId: parseInt(paramStr(req.params.connectionId)) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [conn] = await db
    .update(connectionsTable)
    .set({ status: "rejected" })
    .where(and(eq(connectionsTable.id, parsed.data.connectionId), eq(connectionsTable.connectedUserId, user.id), eq(connectionsTable.status, "pending")))
    .returning();
  if (!conn) {
    res.status(404).json({ error: "Connection request not found" });
    return;
  }
  res.json({ success: true });
});

router.delete("/connections/:connectionId", requireAuth, requireVerified, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const connId = parseInt(paramStr(req.params.connectionId));
  if (!connId) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [conn] = await db
    .delete(connectionsTable)
    .where(and(eq(connectionsTable.id, connId), or(eq(connectionsTable.userId, user.id), eq(connectionsTable.connectedUserId, user.id))))
    .returning();
  if (!conn) {
    res.status(404).json({ error: "Connection not found" });
    return;
  }
  res.json({ success: true });
});

router.get("/connections/requests", requireAuth, requireVerified, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const reqs = await db
    .select()
    .from(connectionsTable)
    .where(and(eq(connectionsTable.connectedUserId, user.id), eq(connectionsTable.status, "pending")));

  const senderIds = [...new Set(reqs.map((r) => r.userId))];
  const profiles = senderIds.length > 0
    ? await db.select().from(profilesTable).where(inArray(profilesTable.userId, senderIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.userId, p]));

  const result = reqs.map((r) => {
    const profile = profileMap.get(r.userId);
    return { ...r, connectedProfile: profile ? { ...profile, matchScore: null } : null };
  });
  res.json(result);
});

export default router;

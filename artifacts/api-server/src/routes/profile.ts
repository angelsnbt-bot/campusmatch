import { Router, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateProfileBody, GetUserProfileParams } from "@workspace/api-zod";
import { type AuthenticatedRequest, requireAuth, extractToken, resolveUser, paramStr } from "../middlewares/auth";

const router = Router();

// GET /api/profile
router.get("/profile", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, user.id)).limit(1);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({
    ...profile,
    isVerified: user.verificationStatus === "approved",
    isFirst100: user.isFirst100,
  });
});

// PATCH /api/profile
router.patch("/profile", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio;
  if (parsed.data.branch !== undefined) updateData.branch = parsed.data.branch;
  if (parsed.data.year !== undefined) updateData.year = parsed.data.year;
  if (parsed.data.hostel !== undefined) updateData.hostel = parsed.data.hostel;
  if (parsed.data.interests !== undefined) updateData.interests = parsed.data.interests;
  if (parsed.data.skills !== undefined) updateData.skills = parsed.data.skills;
  if (parsed.data.avatarUrl !== undefined) updateData.avatarUrl = parsed.data.avatarUrl;

  const [updated] = await db.update(profilesTable).set(updateData).where(eq(profilesTable.userId, user.id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({
    ...updated,
    isVerified: user.verificationStatus === "approved",
    isFirst100: user.isFirst100,
  });
});

// GET /api/profile/:userId
router.get("/profile/:userId", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const parsed = GetUserProfileParams.safeParse({ userId: parseInt(paramStr(req.params.userId)) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, parsed.data.userId)).limit(1);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, parsed.data.userId)).limit(1);
  if (!profile || !user) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({
    ...profile,
    isVerified: user.verificationStatus === "approved",
    isFirst100: user.isFirst100,
  });
});

export default router;

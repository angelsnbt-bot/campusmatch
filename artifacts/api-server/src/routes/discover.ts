import { Router, type Response } from "express";
import { db } from "@workspace/db";
import { profilesTable, likesTable, matchesTable } from "@workspace/db";
import { eq, and, notInArray, inArray } from "drizzle-orm";
import { LikeProfileBody, PassProfileBody } from "@workspace/api-zod";
import { type AuthenticatedRequest, requireAuth, extractToken, resolveUser } from "../middlewares/auth";

const router = Router();

// GET /api/discover
router.get("/discover", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;

  // Only show discover to ERP-verified users
  if (user.verificationStatus !== "approved") {
    res.status(403).json({ error: "Account must be ERP-verified to use Discover" });
    return;
  }

  const alreadyLiked = await db.select({ id: likesTable.targetUserId }).from(likesTable).where(eq(likesTable.userId, user.id));
  const excludeIds = [user.id, ...alreadyLiked.map((l) => l.id)];

  const profiles = await db
    .select()
    .from(profilesTable)
    .where(notInArray(profilesTable.userId, excludeIds))
    .limit(20);

  res.json(
    profiles.map((p) => ({
      ...p,
      matchScore: null,
    }))
  );
});

// POST /api/discover/like
router.post("/discover/like", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const parsed = LikeProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { targetUserId, mode, isSuperLike } = parsed.data;

  await db.insert(likesTable).values({
    userId: user.id,
    targetUserId,
    mode: mode ?? "dating",
    isSuperLike: isSuperLike ?? false,
  }).onConflictDoNothing();

  // Check mutual like
  const [mutualLike] = await db
    .select()
    .from(likesTable)
    .where(and(eq(likesTable.userId, targetUserId), eq(likesTable.targetUserId, user.id)))
    .limit(1);

  let matchId: number | null = null;
  if (mutualLike) {
    // Check if match already exists to prevent duplicates
    const [existingMatch] = await db
      .select()
      .from(matchesTable)
      .where(and(eq(matchesTable.userId, user.id), eq(matchesTable.matchedUserId, targetUserId)))
      .limit(1);
    if (!existingMatch) {
      const [match] = await db.insert(matchesTable).values({
        userId: user.id,
        matchedUserId: targetUserId,
        mode: mode ?? "dating",
      }).returning();
      matchId = match?.id ?? null;
      // Also create reverse match for the other user
      const [existingReverse] = await db
        .select()
        .from(matchesTable)
        .where(and(eq(matchesTable.userId, targetUserId), eq(matchesTable.matchedUserId, user.id)))
        .limit(1);
      if (!existingReverse) {
        await db.insert(matchesTable).values({
          userId: targetUserId,
          matchedUserId: user.id,
          mode: mode ?? "dating",
        });
      }
    } else {
      matchId = existingMatch.id;
    }
  }

  res.json({ liked: true, isMatch: !!mutualLike, matchId });
});

// POST /api/discover/pass
router.post("/discover/pass", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const parsed = PassProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  // Record as a "pass" like to exclude from future discovery
  await db.insert(likesTable).values({
    userId: user.id,
    targetUserId: parsed.data.targetUserId,
    mode: "pass",
    isSuperLike: false,
  }).onConflictDoNothing();
  res.json({ success: true });
});

// GET /api/discover/matches
router.get("/discover/matches", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const matches = await db.select().from(matchesTable).where(eq(matchesTable.userId, user.id)).orderBy(matchesTable.createdAt);

  const matchedIds = [...new Set(matches.map((m) => m.matchedUserId))];
  const profiles = matchedIds.length > 0
    ? await db.select().from(profilesTable).where(inArray(profilesTable.userId, matchedIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.userId, p]));

  const result = matches.map((m) => {
    const profile = profileMap.get(m.matchedUserId);
    return { ...m, matchedProfile: profile ? { ...profile, matchScore: null } : null };
  });
  res.json(result);
});

export default router;

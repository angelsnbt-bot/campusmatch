import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, postsTable, eventsTable, matchesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/modules/summary", async (req, res): Promise<void> => {
  const [totalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
  const [verifiedUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.verificationStatus, "approved"));
  const [totalPosts] = await db.select({ count: sql<number>`count(*)::int` }).from(postsTable);
  const [totalEvents] = await db.select({ count: sql<number>`count(*)::int` }).from(eventsTable);

  const base = verifiedUsers?.count ?? 0;

  res.json({
    modules: [
      { id: "dating", name: "Dating", description: "Verified-only matches, mutual likes, safe chat", emoji: "💗", isNew: false, isPopular: true, isAi: false, activeCount: base },
      { id: "friends", name: "Friends", description: "Campus friends by branch, year, interests", emoji: "👥", isNew: false, isPopular: false, isAi: false, activeCount: base },
      { id: "study", name: "Study Partners", description: "Assignment, exam prep, lab & project groups", emoji: "📚", isNew: false, isPopular: false, isAi: false, activeCount: Math.floor(base * 0.8) },
      { id: "career", name: "Career Hub", description: "Internships, referrals, mock interviews", emoji: "💼", isNew: false, isPopular: false, isAi: false, activeCount: Math.floor(base * 0.5) },
      { id: "hackathons", name: "Hackathons", description: "AI team builder, GitHub match, team chat", emoji: "💻", isNew: false, isPopular: false, isAi: true, activeCount: Math.floor(base * 0.3) },
      { id: "sports", name: "Sports", description: "Teams, tournaments, ground booking", emoji: "⚽", isNew: false, isPopular: false, isAi: false, activeCount: Math.floor(base * 0.6) },
      { id: "clubs", name: "Clubs", description: "Join societies, events, committee roles", emoji: "🎭", isNew: false, isPopular: false, isAi: false, activeCount: Math.floor(base * 0.4) },
      { id: "events", name: "Events", description: "RSVP, countdown timers, QR check-in", emoji: "🎉", isNew: false, isPopular: false, isAi: false, activeCount: totalEvents?.count ?? 0 },
      { id: "marketplace", name: "Marketplace", description: "Buy & sell books, cycles, electronics", emoji: "🛒", isNew: true, isPopular: false, isAi: false, activeCount: Math.floor(base * 0.2) },
      { id: "rides", name: "Ride Sharing", description: "Cab sharing, hometown trips, daily rides", emoji: "🚗", isNew: true, isPopular: false, isAi: false, activeCount: Math.floor(base * 0.1) },
      { id: "food", name: "Food Buddy", description: "Mess reviews, food pals, cafe finder", emoji: "🍔", isNew: false, isPopular: false, isAi: false, activeCount: Math.floor(base * 0.7) },
      { id: "announcements", name: "Announcements", description: "Campus news, alerts, broadcasts", emoji: "📢", isNew: false, isPopular: false, isAi: false, activeCount: totalPosts?.count ?? 0 },
    ],
  });
});

router.get("/stats/overview", async (req, res): Promise<void> => {
  const [verifiedResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.verificationStatus, "approved"));

  const [totalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);

  res.json({
    verifiedUsers: verifiedResult?.count ?? 0,
    totalUsers: totalUsers?.count ?? 0,
    activeModules: 12,
    erpVerifiedProfiles: "100%",
    verificationTime: "<24h",
  });
});

export default router;

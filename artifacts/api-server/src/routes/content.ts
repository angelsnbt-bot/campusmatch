

import { Router, type Response } from "express";
import { db } from "@workspace/db";
import {
  profilesTable,
  postsTable,
  postLikesTable,
  eventsTable,
  eventRsvpsTable,
  listingsTable,
  announcementsTable,
  usersTable,
} from "@workspace/db";
import { eq, and, desc, sql, ilike, or, inArray } from "drizzle-orm";
import {
  CreatePostBody,
  LikePostParams,
  CreateEventBody,
  RsvpEventParams,
  CreateListingBody,
  GetPostsQueryParams,
  GetListingsQueryParams,
} from "@workspace/api-zod";
import { type AuthenticatedRequest, extractToken, resolveUser, paramStr } from "../middlewares/auth";

const router = Router();

// ── POSTS ──────────────────────────────────────────────────────────────────────

router.get("/posts", async (req, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);

  const params = GetPostsQueryParams.safeParse(req.query);
  const category = params.success ? params.data.category : undefined;
  const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
  const limit = Math.min(Math.max(parseInt(paramStr(req.query.limit)) || 50, 1), 100);
  const offset = Math.max(parseInt(paramStr(req.query.offset)) || 0, 0);

  let query = db.select().from(postsTable).$dynamic();
  const conditions = [];
  if (category) conditions.push(eq(postsTable.category, category));
  if (search) {
    const safeSearch = search.replace(/%/g, "\\%").replace(/_/g, "\\_");
    conditions.push(ilike(postsTable.content, `%${safeSearch}%`));
  }
  if (conditions.length > 0) query = query.where(and(...conditions));
  query = query.orderBy(desc(postsTable.createdAt)).limit(limit).offset(offset);

  const posts = await query;

  const userIds = [...new Set(posts.map((p) => p.userId))];
  const profiles = userIds.length > 0
    ? await db.select().from(profilesTable).where(inArray(profilesTable.userId, userIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.userId, p]));

  let likedPostIds = new Set<number>();
  if (user) {
    const postIds = posts.map((p) => p.id);
    if (postIds.length > 0) {
      const likes = await db.select().from(postLikesTable).where(
        and(eq(postLikesTable.userId, user.id), inArray(postLikesTable.postId, postIds))
      );
      likedPostIds = new Set(likes.map((l) => l.postId));
    }
  }

  const result = posts.map((p) => {
    const profile = profileMap.get(p.userId);
    return {
      ...p,
      authorName: profile?.name ?? "Anonymous",
      authorAvatarUrl: profile?.avatarUrl ?? null,
      isLiked: likedPostIds.has(p.id),
    };
  });
  res.json(result);
});

router.get("/posts/:postId", async (req, res: Response): Promise<void> => {
  const postId = parseInt(paramStr(req.params.postId));
  if (!postId) { res.status(400).json({ error: "Invalid post ID" }); return; }
  const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId)).limit(1);
  if (!post) { res.status(404).json({ error: "Post not found" }); return; }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, post.userId)).limit(1);
  res.json({
    ...post,
    authorName: profile?.name ?? "Anonymous",
    authorAvatarUrl: profile?.avatarUrl ?? null,
  });
});

router.post("/posts", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const content = parsed.data.content.trim();
  if (content.length === 0) { res.status(400).json({ error: "Post content cannot be empty" }); return; }
  if (content.length > 2000) { res.status(400).json({ error: "Post content too long (max 2000 characters)" }); return; }
  const [post] = await db.insert(postsTable).values({
    userId: user.id,
    content,
    category: parsed.data.category ?? "general",
    imageUrl: parsed.data.imageUrl ?? null,
  }).returning();
  if (!post) { res.status(500).json({ error: "Failed to create post" }); return; }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, user.id)).limit(1);
  res.status(201).json({ ...post, authorName: profile?.name ?? user.name, authorAvatarUrl: profile?.avatarUrl ?? null, isLiked: false });
});

router.patch("/posts/:postId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const postId = parseInt(paramStr(req.params.postId));
  if (!postId) { res.status(400).json({ error: "Invalid post ID" }); return; }
  const [existing] = await db.select().from(postsTable).where(eq(postsTable.id, postId)).limit(1);
  if (!existing) { res.status(404).json({ error: "Post not found" }); return; }
  if (existing.userId !== user.id && user.role !== "admin" && user.role !== "super_admin") {
    res.status(403).json({ error: "Not authorized to edit this post" }); return;
  }
  const { content, category, imageUrl } = req.body as Record<string, unknown>;
  const updateData: Record<string, unknown> = {};
  if (typeof content === "string") {
    const trimmed = content.trim();
    if (trimmed.length === 0) { res.status(400).json({ error: "Post content cannot be empty" }); return; }
    if (trimmed.length > 2000) { res.status(400).json({ error: "Post content too long (max 2000 characters)" }); return; }
    updateData.content = trimmed;
  }
  if (typeof category === "string") updateData.category = category;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (Object.keys(updateData).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  const [updated] = await db.update(postsTable).set(updateData).where(eq(postsTable.id, postId)).returning();
  res.json(updated);
});

router.delete("/posts/:postId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const postId = parseInt(paramStr(req.params.postId));
  if (!postId) { res.status(400).json({ error: "Invalid post ID" }); return; }
  const [existing] = await db.select().from(postsTable).where(eq(postsTable.id, postId)).limit(1);
  if (!existing) { res.status(404).json({ error: "Post not found" }); return; }
  if (existing.userId !== user.id && user.role !== "admin" && user.role !== "super_admin") {
    res.status(403).json({ error: "Not authorized to delete this post" }); return;
  }
  await db.delete(postLikesTable).where(eq(postLikesTable.postId, postId));
  await db.delete(postsTable).where(eq(postsTable.id, postId));
  res.json({ success: true });
});

// ── POST LIKES ─────────────────────────────────────────────────────────────────

router.post("/posts/:postId/like", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = LikePostParams.safeParse({ postId: parseInt(paramStr(req.params.postId)) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid post ID" }); return; }
  const postId = parsed.data.postId;
  const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId)).limit(1);
  if (!post) { res.status(404).json({ error: "Post not found" }); return; }
  const [existing] = await db.select().from(postLikesTable).where(and(eq(postLikesTable.userId, user.id), eq(postLikesTable.postId, postId))).limit(1);
  if (existing) {
    await db.delete(postLikesTable).where(eq(postLikesTable.id, existing.id));
    await db.update(postsTable).set({ likeCount: sql`GREATEST(${postsTable.likeCount} - 1, 0)` }).where(eq(postsTable.id, postId));
  } else {
    await db.insert(postLikesTable).values({ userId: user.id, postId });
    await db.update(postsTable).set({ likeCount: sql`${postsTable.likeCount} + 1` }).where(eq(postsTable.id, postId));
  }
  res.json({ success: true, liked: !existing });
});

// ── EVENTS ─────────────────────────────────────────────────────────────────────

router.get("/events", async (req, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
  const limit = Math.min(Math.max(parseInt(paramStr(req.query.limit)) || 20, 1), 100);
  const offset = Math.max(parseInt(paramStr(req.query.offset)) || 0, 0);

  let query = db.select().from(eventsTable).$dynamic();
  if (search) {
    const safeSearch = search.replace(/%/g, "\\%").replace(/_/g, "\\_");
    query = query.where(or(ilike(eventsTable.title, `%${safeSearch}%`), ilike(eventsTable.description, `%${safeSearch}%`)));
  }
  query = query.orderBy(desc(eventsTable.date)).limit(limit).offset(offset);
  const events = await query;

  let rsvpEventIds = new Set<number>();
  if (user && events.length > 0) {
    const eventIds = events.map((e) => e.id);
    const rsvps = await db.select().from(eventRsvpsTable).where(
      and(eq(eventRsvpsTable.userId, user.id), inArray(eventRsvpsTable.eventId, eventIds))
    );
    rsvpEventIds = new Set(rsvps.map((r) => r.eventId));
  }

  const result = events.map((e) => ({
    ...e,
    isRsvped: rsvpEventIds.has(e.id),
  }));
  res.json(result);
});

router.post("/events", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    res.status(403).json({ error: "Admin only" }); return;
  }
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [event] = await db.insert(eventsTable).values({
    title: parsed.data.title,
    description: parsed.data.description,
    date: new Date(parsed.data.date),
    venue: parsed.data.venue,
    category: parsed.data.category as "hackathon" | "sports" | "cultural" | "academic" | "social",
    imageUrl: parsed.data.imageUrl ?? null,
  }).returning();
  res.status(201).json({ ...event, isRsvped: false });
});

router.patch("/events/:eventId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    res.status(403).json({ error: "Admin only" }); return;
  }
  const eventId = parseInt(paramStr(req.params.eventId));
  if (!eventId) { res.status(400).json({ error: "Invalid event ID" }); return; }
  const [existing] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!existing) { res.status(404).json({ error: "Event not found" }); return; }
  const { title, description, date, venue, category, imageUrl } = req.body as Record<string, unknown>;
  const updateData: Record<string, unknown> = {};
  if (typeof title === "string") updateData.title = title;
  if (typeof description === "string") updateData.description = description;
  if (typeof date === "string") updateData.date = new Date(date);
  if (typeof venue === "string") updateData.venue = venue;
  if (typeof category === "string") updateData.category = category;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (Object.keys(updateData).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  const [updated] = await db.update(eventsTable).set(updateData).where(eq(eventsTable.id, eventId)).returning();
  res.json(updated);
});

router.delete("/events/:eventId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    res.status(403).json({ error: "Admin only" }); return;
  }
  const eventId = parseInt(paramStr(req.params.eventId));
  if (!eventId) { res.status(400).json({ error: "Invalid event ID" }); return; }
  const [existing] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!existing) { res.status(404).json({ error: "Event not found" }); return; }
  await db.delete(eventRsvpsTable).where(eq(eventRsvpsTable.eventId, eventId));
  await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
  res.json({ success: true });
});

router.post("/events/:eventId/rsvp", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = RsvpEventParams.safeParse({ eventId: parseInt(paramStr(req.params.eventId)) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid event ID" }); return; }
  const eventId = parsed.data.eventId;
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!event) { res.status(404).json({ error: "Event not found" }); return; }
  const [existingRsvp] = await db.select().from(eventRsvpsTable).where(and(eq(eventRsvpsTable.userId, user.id), eq(eventRsvpsTable.eventId, eventId))).limit(1);
  if (existingRsvp) {
    await db.delete(eventRsvpsTable).where(eq(eventRsvpsTable.id, existingRsvp.id));
    await db.update(eventsTable).set({ rsvpCount: sql`GREATEST(${eventsTable.rsvpCount} - 1, 0)` }).where(eq(eventsTable.id, eventId));
    res.json({ success: true, rsvped: false });
    return;
  }
  await db.insert(eventRsvpsTable).values({ userId: user.id, eventId });
  await db.update(eventsTable).set({ rsvpCount: sql`${eventsTable.rsvpCount} + 1` }).where(eq(eventsTable.id, eventId));
  res.json({ success: true, rsvped: true });
});

// ── MARKETPLACE ────────────────────────────────────────────────────────────────

router.get("/marketplace", async (req, res: Response): Promise<void> => {
  const token = extractToken(req);
  const requester = await resolveUser(token);
  const canSeeContact = !!requester && requester.verificationStatus === "approved";

  const params = GetListingsQueryParams.safeParse(req.query);
  const category = params.success ? params.data.category : undefined;
  const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const limit = Math.min(Math.max(parseInt(paramStr(req.query.limit)) || 50, 1), 100);
  const offset = Math.max(parseInt(paramStr(req.query.offset)) || 0, 0);

  let query = db.select().from(listingsTable).$dynamic();
  const conditions = [];
  if (category) conditions.push(eq(listingsTable.category, category));
  if (status) conditions.push(eq(listingsTable.status, status as "available" | "sold"));
  if (search) {
    const safeSearch = search.replace(/%/g, "\\%").replace(/_/g, "\\_");
    conditions.push(or(ilike(listingsTable.title, `%${safeSearch}%`), ilike(listingsTable.description, `%${safeSearch}%`)));
  }
  if (conditions.length > 0) query = query.where(and(...conditions));
  query = query.orderBy(desc(listingsTable.createdAt)).limit(limit).offset(offset);
  const listings = await query;

  const userIds = [...new Set(listings.map((l) => l.userId))];
  const profiles = userIds.length > 0
    ? await db.select().from(profilesTable).where(inArray(profilesTable.userId, userIds))
    : [];
  const users = userIds.length > 0
    ? await db.select({ id: usersTable.id, phone: usersTable.phone }).from(usersTable).where(inArray(usersTable.id, userIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.userId, p]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  const result = listings.map((l) => {
    const profile = profileMap.get(l.userId);
    const user = userMap.get(l.userId);
    return {
      ...l,
      sellerName: profile?.name ?? "Anonymous",
      sellerPhone: canSeeContact ? user?.phone ?? null : null,
    };
  });
  res.json(result);
});

router.post("/marketplace", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (user.verificationStatus !== "approved") {
    res.status(403).json({ error: "Account must be ERP-verified to list items" }); return;
  }
  const parsed = CreateListingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [listing] = await db.insert(listingsTable).values({
    userId: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    price: Math.round(parsed.data.price),
    category: parsed.data.category as "books" | "cycles" | "electronics" | "furniture" | "other",
    imageUrl: parsed.data.imageUrl ?? null,
  }).returning();
  if (!listing) { res.status(500).json({ error: "Failed to create listing" }); return; }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, user.id)).limit(1);
  res.status(201).json({ ...listing, sellerName: profile?.name ?? user.name });
});

router.patch("/marketplace/:listingId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const listingId = parseInt(paramStr(req.params.listingId));
  if (!listingId) { res.status(400).json({ error: "Invalid listing ID" }); return; }
  const [existing] = await db.select().from(listingsTable).where(eq(listingsTable.id, listingId)).limit(1);
  if (!existing) { res.status(404).json({ error: "Listing not found" }); return; }
  if (existing.userId !== user.id && user.role !== "admin" && user.role !== "super_admin") {
    res.status(403).json({ error: "Not authorized to edit this listing" }); return;
  }
  const { title, description, price, category, imageUrl } = req.body as Record<string, unknown>;
  const updateData: Record<string, unknown> = {};
  if (typeof title === "string") updateData.title = title;
  if (typeof description === "string") updateData.description = description;
  if (typeof price === "number" || typeof price === "string") updateData.price = Math.round(Number(price));
  if (typeof category === "string") updateData.category = category;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (Object.keys(updateData).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  const [updated] = await db.update(listingsTable).set(updateData).where(eq(listingsTable.id, listingId)).returning();
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, user.id)).limit(1);
  res.json({ ...updated, sellerName: profile?.name ?? user.name });
});

router.delete("/marketplace/:listingId", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const listingId = parseInt(paramStr(req.params.listingId));
  if (!listingId) { res.status(400).json({ error: "Invalid listing ID" }); return; }
  const [existing] = await db.select().from(listingsTable).where(eq(listingsTable.id, listingId)).limit(1);
  if (!existing) { res.status(404).json({ error: "Listing not found" }); return; }
  if (existing.userId !== user.id && user.role !== "admin" && user.role !== "super_admin") {
    res.status(403).json({ error: "Not authorized to delete this listing" }); return;
  }
  await db.delete(listingsTable).where(eq(listingsTable.id, listingId));
  res.json({ success: true });
});

router.put("/marketplace/:listingId/sold", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = extractToken(req);
  const user = await resolveUser(token);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  const listingId = parseInt(paramStr(req.params.listingId));
  if (!listingId) { res.status(400).json({ error: "Invalid listing ID" }); return; }
  const [existing] = await db.select().from(listingsTable).where(eq(listingsTable.id, listingId)).limit(1);
  if (!existing) { res.status(404).json({ error: "Listing not found" }); return; }
  if (existing.userId !== user.id && user.role !== "admin" && user.role !== "super_admin") {
    res.status(403).json({ error: "Not authorized" }); return;
  }
  const newStatus = existing.status === "sold" ? "available" : "sold";
  const [updated] = await db.update(listingsTable).set({ status: newStatus as "available" | "sold" }).where(eq(listingsTable.id, listingId)).returning();
  res.json(updated);
});

// ── ANNOUNCEMENTS ──────────────────────────────────────────────────────────────

router.get("/announcements", async (req, res: Response): Promise<void> => {
  const announcements = await db.select().from(announcementsTable).orderBy(desc(announcementsTable.createdAt)).limit(20);
  res.json(announcements);
});

export default router;

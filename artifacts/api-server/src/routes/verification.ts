import { Router, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable, verificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubmitVerificationBody } from "@workspace/api-zod";
import { type AuthenticatedRequest, requireAuth } from "../middlewares/auth";

const router = Router();

// POST /api/verification/submit
router.post("/verification/submit", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const parsed = SubmitVerificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { erpNumber, collegeEmail, idCardUrl } = parsed.data;

  // Check duplicate ERP
  const existing = await db.select().from(verificationsTable).where(eq(verificationsTable.erpNumber, erpNumber)).limit(1);
  if (existing.length > 0 && existing[0]?.userId !== user.id) {
    res.status(409).json({ error: "ERP number already registered" });
    return;
  }

  // Upsert verification record
  const [verification] = await db
    .insert(verificationsTable)
    .values({
      userId: user.id,
      erpNumber,
      collegeEmail: collegeEmail ?? null,
      idCardUrl: idCardUrl ?? null,
      status: "pending",
    })
    .onConflictDoUpdate({
      target: verificationsTable.userId,
      set: {
        erpNumber,
        collegeEmail: collegeEmail ?? null,
        idCardUrl: idCardUrl ?? null,
        status: "pending",
        rejectionReason: null,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!verification) {
    res.status(500).json({ error: "Failed to submit verification" });
    return;
  }

  // Update user status to pending
  await db.update(usersTable).set({ verificationStatus: "pending" }).where(eq(usersTable.id, user.id));

  res.status(201).json({
    id: verification.id,
    userId: verification.userId,
    status: verification.status,
    erpNumber: verification.erpNumber,
    rejectionReason: verification.rejectionReason,
    createdAt: verification.createdAt,
    updatedAt: verification.updatedAt,
  });
});

// GET /api/verification/status
router.get("/verification/status", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const [verification] = await db.select().from(verificationsTable).where(eq(verificationsTable.userId, user.id)).limit(1);
  if (!verification) {
    res.json({
      id: 0,
      userId: user.id,
      status: "unverified",
      erpNumber: "",
      rejectionReason: null,
      createdAt: new Date(),
      updatedAt: null,
    });
    return;
  }
  res.json({
    id: verification.id,
    userId: verification.userId,
    status: verification.status,
    erpNumber: verification.erpNumber,
    rejectionReason: verification.rejectionReason,
    createdAt: verification.createdAt,
    updatedAt: verification.updatedAt,
  });
});

export default router;

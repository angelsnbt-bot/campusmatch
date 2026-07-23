import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, profilesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";
import {
  RegisterBody,
  LoginBody,
  VerifyEmailBody,
  ForgotPasswordRequestBody,
  VerifyForgotOtpCodeBody,
  ResetPasswordSubmitBody,
} from "@workspace/api-zod";
import { authRateLimit } from "../middlewares/rateLimit";
import { logger } from "../lib/logger";
import { store } from "../lib/store";

const router = Router();

const REFRESH_TOKEN_EXPIRY_DAYS = 30;
const REFRESH_TOKEN_EXPIRY_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

const OTP_LOCKOUT_MS = 15 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(hashToVerify, "hex"));
}

function hashOtp(otp: string): string {
  const salt = process.env.OTP_SALT || "campusmatch_otp_salt";
  return crypto.createHash("sha256").update(otp + salt).digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

async function sendResendEmail(to: string, subject: string, htmlContent: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn({ to }, "RESEND_API_KEY not set. Email not sent.");
    return;
  }
  const fromAddress = process.env.RESEND_FROM || "CampusMatch <onboarding@campusmatch.in>";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to,
        subject,
        html: htmlContent,
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      logger.error({ errText }, "Failed to send email via Resend");
    }
  } catch (err) {
    logger.error({ err }, "Failed to send email via Resend");
  }
}

router.post("/auth/register", authRateLimit, async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, email, password, phone, erpNumber, college, course, branch, year, photoUrl, interests, acceptTerms } = parsed.data;

  if (!acceptTerms) {
    res.status(400).json({ error: "You must accept the terms and conditions" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already exists" });
    return;
  }
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const verifiedCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.verificationStatus, "approved"));
  const isFirst100 = (verifiedCount[0]?.count ?? 0) < 100;

  const [user] = await db.insert(usersTable).values({
    name,
    email,
    phone: phone ?? null,
    passwordHash: hashPassword(password),
    emailOtp: hashOtp(otp),
    otpExpiresAt,
    isFirst100,
    avatarUrl: photoUrl ?? null,
  }).returning();

  if (!user) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }

  await sendResendEmail(
    email,
    "Verify your CampusMatch Email",
    `<p>Thank you for signing up for CampusMatch! Your verification OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  );

  await db.insert(profilesTable).values({
    userId: user.id,
    name: user.name,
    avatarUrl: photoUrl ?? null,
    college: college ?? "",
    course: course ?? "",
    branch: branch ?? "",
    year: year ?? 1,
    interests: interests ?? [],
  });

  const token = generateToken();
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
  await db.update(usersTable).set({ jwtToken: token, refreshToken, refreshTokenExpiresAt }).where(eq(usersTable.id, user.id));

  req.log.info({ userId: user.id }, "User registered");
  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      emailVerified: user.emailVerified,
      isFirst100: user.isFirst100,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token,
    refreshToken,
  });
});

router.post("/auth/login", authRateLimit, async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  if (user.isBanned) {
    res.status(403).json({ error: "Account is banned" });
    return;
  }
  const token = generateToken();
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
  await db.update(usersTable).set({ jwtToken: token, refreshToken, refreshTokenExpiresAt }).where(eq(usersTable.id, user.id));
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      emailVerified: user.emailVerified,
      isFirst100: user.isFirst100,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token,
    refreshToken,
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    // Look up user by token first, then update by ID for atomicity
    const [user] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.jwtToken, token)).limit(1);
    if (user) {
      await db.update(usersTable).set({ jwtToken: null, refreshToken: null, refreshTokenExpiresAt: null }).where(eq(usersTable.id, user.id));
    }
  }
  res.json({ success: true });
});

router.post("/auth/refresh", async (req, res): Promise<void> => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.refreshToken, refreshToken)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }
  if (user.isBanned) {
    res.status(403).json({ error: "Account is banned" });
    return;
  }
  if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
    res.status(401).json({ error: "Refresh token expired" });
    return;
  }

  const newToken = generateToken();
  const newRefreshToken = generateRefreshToken();
  const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
  await db.update(usersTable).set({ jwtToken: newToken, refreshToken: newRefreshToken, refreshTokenExpiresAt: newExpiresAt }).where(eq(usersTable.id, user.id));

  res.json({ token: newToken, refreshToken: newRefreshToken });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.jwtToken, token)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (user.isBanned) {
    res.status(403).json({ error: "Account is banned" });
    return;
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verificationStatus: user.verificationStatus,
    emailVerified: user.emailVerified,
    isFirst100: user.isFirst100,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  });
});

router.post("/auth/verify-email", authRateLimit, async (req, res): Promise<void> => {
  const parsed = VerifyEmailBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.jwtToken, token)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
    res.status(400).json({ error: "OTP expired. Please request a new one." });
    return;
  }

  const attemptData = await store.get(`otp:${user.id}`);
  const attempts = attemptData ? JSON.parse(attemptData) : { count: 0, lockedUntil: 0 };
  if (attempts.lockedUntil > Date.now()) {
    const waitMin = Math.ceil((attempts.lockedUntil - Date.now()) / (60 * 1000));
    res.status(429).json({ error: `Too many failed attempts. Try again in ${waitMin} minutes.` });
    return;
  }

  if (user.emailOtp !== hashOtp(parsed.data.otp)) {
    attempts.count += 1;
    if (attempts.count >= OTP_MAX_ATTEMPTS) {
      attempts.lockedUntil = Date.now() + OTP_LOCKOUT_MS;
      attempts.count = 0;
      await store.set(`otp:${user.id}`, JSON.stringify(attempts), OTP_LOCKOUT_MS);
      res.status(429).json({ error: "Too many failed attempts. Account locked for 15 minutes." });
      return;
    }
    await store.set(`otp:${user.id}`, JSON.stringify(attempts), OTP_LOCKOUT_MS);
    res.status(400).json({ error: `Invalid OTP. ${OTP_MAX_ATTEMPTS - attempts.count} attempts remaining.` });
    return;
  }

  await store.del(`otp:${user.id}`);
  await db.update(usersTable).set({ emailVerified: true, emailOtp: null, otpExpiresAt: null }).where(eq(usersTable.id, user.id));
  res.json({ success: true });
});

router.post("/auth/resend-otp", authRateLimit, async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.jwtToken, token)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (user.otpExpiresAt) {
    const lastIssued = new Date(user.otpExpiresAt.getTime() - 10 * 60 * 1000);
    const diffMs = Date.now() - lastIssued.getTime();
    if (diffMs < 60 * 1000) {
      const waitSec = Math.ceil((60 * 1000 - diffMs) / 1000);
      res.status(429).json({ error: `Please wait ${waitSec}s before requesting another OTP` });
      return;
    }
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await db.update(usersTable).set({ emailOtp: hashOtp(otp), otpExpiresAt }).where(eq(usersTable.id, user.id));

  await store.del(`otp:${user.id}`);

  await sendResendEmail(
    user.email,
    "Your New CampusMatch Verification OTP",
    `<p>Your new verification OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  );

  req.log.info({ userId: user.id }, "OTP resent");
  res.json({ success: true, message: "OTP sent to your email. Check inbox." });
});

router.post("/auth/forgot-password", authRateLimit, async (req, res): Promise<void> => {
  const parsed = ForgotPasswordRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.json({ success: true, message: "If this email is registered, you will receive an OTP." });
    return;
  }

  if (user.otpExpiresAt) {
    const lastIssued = new Date(user.otpExpiresAt.getTime() - 10 * 60 * 1000);
    const diffMs = Date.now() - lastIssued.getTime();
    if (diffMs < 60 * 1000) {
      const waitSec = Math.ceil((60 * 1000 - diffMs) / 1000);
      res.status(429).json({ error: `Please wait ${waitSec}s before requesting another OTP` });
      return;
    }
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await db.update(usersTable).set({ emailOtp: hashOtp(otp), otpExpiresAt }).where(eq(usersTable.id, user.id));

  await store.del(`otp:${user.id}`);

  await sendResendEmail(
    email,
    "Reset your CampusMatch Password",
    `<p>You requested a password reset. Your OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  );

  res.json({ success: true, message: "If this email is registered, you will receive an OTP." });
});

router.post("/auth/verify-forgot-otp", authRateLimit, async (req, res): Promise<void> => {
  const parsed = VerifyForgotOtpCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, otp } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
    res.status(400).json({ error: "OTP expired. Request a new one." });
    return;
  }

  const attemptData = await store.get(`otp:${user.id}`);
  const attempts = attemptData ? JSON.parse(attemptData) : { count: 0, lockedUntil: 0 };
  if (attempts.lockedUntil > Date.now()) {
    const waitMin = Math.ceil((attempts.lockedUntil - Date.now()) / (60 * 1000));
    res.status(429).json({ error: `Too many failed attempts. Try again in ${waitMin} minutes.` });
    return;
  }

  if (user.emailOtp !== hashOtp(otp)) {
    attempts.count += 1;
    if (attempts.count >= OTP_MAX_ATTEMPTS) {
      attempts.lockedUntil = Date.now() + OTP_LOCKOUT_MS;
      attempts.count = 0;
      await store.set(`otp:${user.id}`, JSON.stringify(attempts), OTP_LOCKOUT_MS);
      res.status(429).json({ error: "Too many failed attempts. Account locked for 15 minutes." });
      return;
    }
    await store.set(`otp:${user.id}`, JSON.stringify(attempts), OTP_LOCKOUT_MS);
    res.status(400).json({ error: `Invalid OTP. ${OTP_MAX_ATTEMPTS - attempts.count} attempts remaining.` });
    return;
  }

  await store.del(`otp:${user.id}`);

  await db.update(usersTable).set({ emailOtp: null, otpExpiresAt: null }).where(eq(usersTable.id, user.id));

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetData = JSON.stringify({ email, expiresAt: Date.now() + RESET_TOKEN_TTL_MS });
  await store.set(`reset:${resetToken}`, resetData, RESET_TOKEN_TTL_MS);

  res.json({ resetToken });
});

router.post("/auth/reset-password", authRateLimit, async (req, res): Promise<void> => {
  const parsed = ResetPasswordSubmitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { resetToken, password } = parsed.data;

  const sessionData = await store.get(`reset:${resetToken}`);
  if (!sessionData) {
    res.status(400).json({ error: "Invalid or expired reset token" });
    return;
  }

  const session = JSON.parse(sessionData) as { email: string; expiresAt: number };
  if (session.expiresAt < Date.now()) {
    await store.del(`reset:${resetToken}`);
    res.status(400).json({ error: "Reset token expired" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, session.email)).limit(1);
  if (!user) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  await db.update(usersTable)
    .set({ passwordHash: hashPassword(password), jwtToken: null, refreshToken: null, refreshTokenExpiresAt: null })
    .where(eq(usersTable.id, user.id));

  await store.del(`reset:${resetToken}`);

  res.json({ success: true, message: "Password reset successfully. Please login." });
});

export default router;

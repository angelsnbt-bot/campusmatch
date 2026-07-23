import { type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    verificationStatus: string;
    emailVerified: boolean;
    isFirst100: boolean;
    avatarUrl: string | null;
    isBanned: boolean;
    jwtToken: string | null;
    createdAt: Date;
  };
}

async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.jwtToken, token)).limit(1);
  return user ?? null;
}

export function paramStr(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? "");
  if (typeof value === "string") return value;
  return "";
}

export function extractToken(req: Request): string | undefined {
  return req.headers.authorization?.replace("Bearer ", "");
}

export async function resolveUser(token: string | undefined) {
  const user = await getUserFromToken(token);
  if (user && user.isBanned) return null;
  return user;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  getUserFromToken(token).then((user) => {
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (user.isBanned) {
      res.status(403).json({ error: "Account is banned" });
      return;
    }
    req.user = user;
    next();
  }).catch(() => {
    res.status(500).json({ error: "Internal server error" });
  });
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  getUserFromToken(token).then((user) => {
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (user.isBanned) {
      res.status(403).json({ error: "Account is banned" });
      return;
    }
    if (user.role !== "admin" && user.role !== "super_admin") {
      res.status(403).json({ error: "Admin only" });
      return;
    }
    req.user = user;
    next();
  }).catch(() => {
    res.status(500).json({ error: "Internal server error" });
  });
}

export function requireVerified(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (req.user.verificationStatus !== "approved") {
    res.status(403).json({ error: "Account must be ERP-verified to access this feature" });
    return;
  }
  next();
}

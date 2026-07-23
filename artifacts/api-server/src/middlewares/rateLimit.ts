import { type Request, type Response, type NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

const rateLimitStores = new Map<string, Map<string, { count: number; resetAt: number }>>();

// Periodically clean up all rate limit stores every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [, store] of rateLimitStores) {
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, message = "Too many requests. Please try again later.", keyGenerator } = options;
  const namespace = `rl:${windowMs}:${max}`;

  // Use shared store so periodic cleanup works
  if (!rateLimitStores.has(namespace)) {
    rateLimitStores.set(namespace, new Map());
  }
  const counts = rateLimitStores.get(namespace)!;

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = keyGenerator ? keyGenerator(req) : (req.ip ?? req.socket.remoteAddress ?? "unknown");
    const storeKey = `${namespace}:${key}`;

    let entry = counts.get(storeKey);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      counts.set(storeKey, entry);
    }

    entry.count++;

    const remaining = Math.max(0, max - entry.count);
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

    if (entry.count > max) {
      res.setHeader("Retry-After", retryAfter);
      res.status(429).json({ error: message });
      return;
    }

    next();
  };
}

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  message: "Too many requests. Please slow down.",
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many uploads. Please wait before uploading again.",
});

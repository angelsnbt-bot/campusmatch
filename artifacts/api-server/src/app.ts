import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import crypto from "crypto";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";
import { apiRateLimit } from "./middlewares/rateLimit";

const app: Express = express();

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.id = crypto.randomUUID();
  next();
});

app.use((_req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    logger.info({ method: _req.method, url: _req.url?.split("?")[0], status: res.statusCode, ms });
  });
  next();
});

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

app.use("/api", apiRateLimit, router);

if (process.env.STORAGE_DRIVER !== "s3") {
  app.use("/api/uploads", express.static(path.join(process.cwd(), "artifacts", "api-server", "uploads"), {
    maxAge: "30d",
    immutable: true,
  }));
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err: err.message }, "Unhandled error");
  if (res.headersSent) return;
  res.status(500).json({ error: "Internal server error" });
});

export default app;

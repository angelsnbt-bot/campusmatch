import { Router, type Response } from "express";
import multer from "multer";
import crypto from "crypto";
import { type AuthenticatedRequest, requireAuth } from "../middlewares/auth";
import { uploadRateLimit } from "../middlewares/rateLimit";
import { storage, generateFilename } from "../lib/storage";

const router = Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
});

function handleUpload(folder: string) {
  return (req: AuthenticatedRequest, res: Response): void => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const filename = generateFilename(file.originalname);
    storage.upload(file.buffer, filename, file.mimetype, folder)
      .then((result) => {
        res.json({ url: result.url });
      })
      .catch((err) => {
        res.status(500).json({ error: "Upload failed" });
      });
  };
}

function withMulter(fieldName: string) {
  return (req: AuthenticatedRequest, res: Response, next: () => void) => {
    memoryUpload.single(fieldName)(req, res, (err) => {
      if (err) {
        const msg = err instanceof multer.MulterError ? err.message : String(err);
        res.status(400).json({ error: msg });
        return;
      }
      next();
    });
  };
}

router.post(
  "/upload/profile-image",
  uploadRateLimit,
  requireAuth,
  withMulter("file"),
  handleUpload("profiles"),
);

router.post(
  "/upload/id-card",
  uploadRateLimit,
  requireAuth,
  withMulter("file"),
  handleUpload("id-cards"),
);

router.post(
  "/upload/post-image",
  uploadRateLimit,
  requireAuth,
  withMulter("file"),
  handleUpload("posts"),
);

export default router;

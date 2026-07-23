import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { logger } from "./logger";

export interface UploadResult {
  url: string;
  key: string;
}

export interface StorageAdapter {
  upload(buffer: Buffer, filename: string, contentType: string, folder: string): Promise<UploadResult>;
  getPublicUrl(key: string): string;
}

class LocalStorage implements StorageAdapter {
  private root: string;
  private publicBase: string;

  constructor(root: string, publicBase: string) {
    this.root = root;
    this.publicBase = publicBase;
    for (const dir of ["profiles", "id-cards", "posts"]) {
      const full = path.join(root, dir);
      if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
    }
  }

  async upload(buffer: Buffer, filename: string, _contentType: string, folder: string): Promise<UploadResult> {
    const dir = path.join(this.root, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, filename);
    fs.writeFileSync(dest, buffer);
    const key = `${folder}/${filename}`;
    return { url: `${this.publicBase}/${key}`, key };
  }

  getPublicUrl(key: string): string {
    return `${this.publicBase}/${key}`;
  }
}

class S3Storage implements StorageAdapter {
  private client: S3Client;
  private bucket: string;
  private publicBase: string;

  constructor(config: {
    endpoint?: string;
    region: string;
    bucket: string;
    publicBase: string;
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucket = config.bucket;
    this.publicBase = config.publicBase.replace(/\/$/, "");
  }

  async upload(buffer: Buffer, filename: string, contentType: string, folder: string): Promise<UploadResult> {
    const key = `${folder}/${filename}`;
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }));
    return { url: `${this.publicBase}/${key}`, key };
  }

  getPublicUrl(key: string): string {
    return `${this.publicBase}/${key}`;
  }
}

function createStorage(): StorageAdapter {
  const driver = process.env.STORAGE_DRIVER ?? "local";

  if (driver === "s3") {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION ?? "auto";
    const bucket = process.env.S3_BUCKET;
    const publicBase = process.env.S3_PUBLIC_URL;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!bucket || !publicBase || !accessKeyId || !secretAccessKey) {
      throw new Error("S3_STORAGE: S3_BUCKET, S3_PUBLIC_URL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY are required");
    }

    logger.info({ driver: "s3", bucket, endpoint }, "Storage initialized");
    return new S3Storage({ endpoint, region, bucket, publicBase, accessKeyId, secretAccessKey });
  }

  const root = path.join(process.cwd(), "artifacts", "api-server", "uploads");
  logger.info({ driver: "local", root }, "Storage initialized");
  return new LocalStorage(root, "/api/uploads");
}

export const storage = createStorage();

export function generateFilename(originalName: string): string {
  const ext = path.extname(originalName) || ".jpg";
  return `${crypto.randomBytes(16).toString("hex")}${ext}`;
}

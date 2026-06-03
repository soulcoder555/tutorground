import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env";

let s3: S3Client | null = null;

function getStorageClient() {
  if (env.STORAGE_DRIVER === "local") return null;
  if (!s3) {
    s3 = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      credentials: env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY ? {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY
      } : undefined
    });
  }
  return s3;
}

export async function uploadFile(file: Express.Multer.File, folder: string) {
  const ext = path.extname(file.originalname).toLowerCase() || ".bin";
  const key = `${folder}/${crypto.randomUUID()}${ext}`;
  const client = getStorageClient();

  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );
    return `${env.S3_PUBLIC_BASE_URL || ""}/${key}`.replace(/([^:]\/)\/+/g, "$1");
  }

  const uploadDir = path.join(process.cwd(), "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = path.basename(key);
  const localPath = path.join(uploadDir, filename);
  await fs.writeFile(localPath, file.buffer);
  return `/uploads/${folder}/${filename}`;
}


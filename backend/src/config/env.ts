import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../.env" });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  BACKEND_URL: z.string().url().default("http://localhost:4000"),
  JWT_ACCESS_SECRET: z.string().min(24),
  JWT_REFRESH_SECRET: z.string().min(24),
  COOKIE_DOMAIN: z.string().optional(),
  OTP_PROVIDER: z.enum(["mock", "msg91", "twilio"]).default("mock"),
  MSG91_AUTH_KEY: z.string().optional(),
  MSG91_TEMPLATE_ID: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_PHONE: z.string().optional(),
  STORAGE_DRIVER: z.enum(["local", "s3", "r2"]).default("local"),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().default("tutorground"),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_BASE_URL: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional()
});

const testDefaults =
  process.env.NODE_ENV === "test"
    ? {
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/tutorground_test?schema=public",
        JWT_ACCESS_SECRET: "test-access-secret-with-enough-length",
        JWT_REFRESH_SECRET: "test-refresh-secret-with-enough-length"
      }
    : {};

export const env = envSchema.parse({ ...testDefaults, ...process.env });
export const isProduction = env.NODE_ENV === "production";

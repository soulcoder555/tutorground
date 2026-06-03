import crypto from "crypto";
import bcrypt from "bcrypt";

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function hashSecret(value: string) {
  return bcrypt.hash(value, 12);
}

export async function compareSecret(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export function generateSecureToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hashForLookup(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}


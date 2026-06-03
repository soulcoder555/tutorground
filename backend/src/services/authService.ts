import bcrypt from "bcrypt";
import type { Role, User } from "@prisma/client";
import { env, isProduction } from "../config/env";
import { getPrisma } from "../prisma";
import { badRequest, conflict, unauthorized } from "../utils/apiError";
import { compareSecret, generateOtp, generateSecureToken, hashForLookup, hashSecret } from "../utils/otp";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const authCookieOptions = {
  access: ACCESS_COOKIE_OPTIONS,
  refresh: REFRESH_COOKIE_OPTIONS
};

function publicUser(user: Pick<User, "id" | "name" | "email" | "phone" | "role" | "avatarUrl" | "isVerified" | "createdAt">) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone.startsWith("email-only:") ? null : user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isVerified: user.isVerified,
    createdAt: user.createdAt
  };
}

function temporaryPhoneForEmail(email: string) {
  return `email-only:${email.toLowerCase()}`;
}

export async function signup(input: { name: string; email: string; password: string; role: Role; phone?: string }) {
  const prisma = getPrisma();
  const email = input.email.toLowerCase();
  const phone = input.phone || temporaryPhoneForEmail(email);
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] }
  });
  if (existing) throw conflict("Email is already registered");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      phone,
      passwordHash,
      role: input.role
    }
  });

  return publicUser(user);
}

export async function login(input: { email: string; password: string }) {
  const user = await getPrisma().user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user) throw unauthorized("No account found for this email. Create an account first.", "ACCOUNT_NOT_FOUND");
  if (!user.isActive) throw unauthorized("This account is disabled. Contact TutorGround support.", "ACCOUNT_DISABLED");
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw unauthorized("Incorrect password. Please try again.", "INVALID_PASSWORD");
  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

export async function issueTokens(user: Pick<User, "id" | "email" | "name" | "role">) {
  const accessToken = signAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  const tokenId = generateSecureToken(16);
  const refreshToken = signRefreshToken({ id: user.id, email: user.email, name: user.name, role: user.role, tokenId });
  await getPrisma().refreshToken.create({
    data: {
      id: tokenId,
      userId: user.id,
      tokenHash: hashForLookup(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const prisma = getPrisma();
  const saved = await prisma.refreshToken.findUnique({
    where: { id: payload.tokenId },
    include: { user: true }
  });
  if (!saved || saved.revokedAt || saved.expiresAt < new Date()) throw unauthorized("Refresh token is no longer valid");
  if (saved.tokenHash !== hashForLookup(refreshToken)) throw unauthorized("Refresh token mismatch");

  const tokens = await issueTokens(saved.user);
  await prisma.refreshToken.update({
    where: { id: saved.id },
    data: { revokedAt: new Date(), replacedByToken: hashForLookup(tokens.refreshToken) }
  });
  return { user: publicUser(saved.user), ...tokens };
}

export async function logout(refreshToken?: string) {
  if (!refreshToken) return;
  const payload = verifyRefreshToken(refreshToken);
  await getPrisma().refreshToken.updateMany({
    where: { id: payload.tokenId, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export async function sendOtp(phone: string) {
  const otp = generateOtp();
  await getPrisma().otpChallenge.create({
    data: {
      phone,
      otpHash: await hashSecret(otp),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
  });

  if (env.OTP_PROVIDER === "mock") {
    return { sent: true, devOtp: isProduction ? undefined : otp };
  }

  return { sent: true };
}

export async function verifyOtp(phone: string, otp: string) {
  const prisma = getPrisma();
  const challenge = await prisma.otpChallenge.findFirst({
    where: {
      phone,
      consumedAt: null,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" }
  });
  if (!challenge) throw badRequest("OTP expired or not found", "OTP_EXPIRED");
  if (challenge.attempts >= 3) throw badRequest("OTP attempts exceeded", "OTP_LOCKED");

  const ok = await compareSecret(otp, challenge.otpHash);
  if (!ok) {
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
    throw badRequest("Invalid OTP", "INVALID_OTP");
  }

  await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: new Date() } });
  await prisma.user.updateMany({ where: { phone }, data: { isVerified: true } });
  return { verified: true };
}

export async function createPasswordReset(email: string) {
  const user = await getPrisma().user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { sent: true };
  const token = generateSecureToken(32);
  await getPrisma().passwordReset.create({
    data: {
      userId: user.id,
      tokenHash: hashForLookup(token),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    }
  });
  return { sent: true, devResetToken: isProduction ? undefined : token };
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = hashForLookup(token);
  const reset = await getPrisma().passwordReset.findUnique({ where: { tokenHash } });
  if (!reset || reset.consumedAt || reset.expiresAt < new Date()) throw badRequest("Reset token is invalid", "INVALID_RESET_TOKEN");
  await getPrisma().$transaction([
    getPrisma().user.update({ where: { id: reset.userId }, data: { passwordHash: await bcrypt.hash(password, 12) } }),
    getPrisma().passwordReset.update({ where: { id: reset.id }, data: { consumedAt: new Date() } })
  ]);
  return { reset: true };
}

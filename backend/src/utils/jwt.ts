import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config/env";
import { unauthorized } from "./apiError";

export type TokenPayload = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: TokenPayload & { tokenId: string }) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
  } catch {
    throw unauthorized("Invalid or expired access token");
  }
}

export function verifyRefreshToken(token: string): TokenPayload & { tokenId: string } {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload & { tokenId: string };
  } catch {
    throw unauthorized("Invalid or expired refresh token");
  }
}


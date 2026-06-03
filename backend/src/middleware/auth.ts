import type { NextFunction, Response } from "express";
import { getPrisma } from "../prisma";
import type { AuthenticatedRequest } from "../types";
import { unauthorized } from "../utils/apiError";
import { verifyAccessToken } from "../utils/jwt";

export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const token = bearerToken || req.cookies?.accessToken;
  if (!token) return next(unauthorized());

  try {
    const payload = verifyAccessToken(token);
    const user = await getPrisma().user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });
    if (!user || !user.isActive) return next(unauthorized("User is inactive or missing"));
    req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
    return next();
  } catch (error) {
    return next(error);
  }
}


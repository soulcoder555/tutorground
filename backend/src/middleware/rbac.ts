import type { NextFunction, Response } from "express";
import type { Role } from "@prisma/client";
import type { AuthenticatedRequest } from "../types";
import { forbidden, unauthorized } from "../utils/apiError";

export function requireRole(...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    return next();
  };
}


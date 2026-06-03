import type { NextFunction, Request, Response } from "express";
import { getRedis } from "../services/cacheService";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyPrefix: string;
  keyGenerator?: (req: Request) => string;
};

const memoryHits = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, options: RateLimitOptions, res: Response, next: NextFunction) {
  const now = Date.now();
  const existing = memoryHits.get(key);
  if (!existing || existing.resetAt < now) {
    memoryHits.set(key, { count: 1, resetAt: now + options.windowMs });
    return next();
  }
  existing.count += 1;
  if (existing.count > options.max) {
    return res.status(429).json({ error: "Too many requests. Please try again later.", code: "RATE_LIMITED" });
  }
  return next();
}

export function rateLimit(options: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identity = options.keyGenerator?.(req) || req.ip || "anonymous";
    const key = `${options.keyPrefix}:${identity}`;
    const redis = getRedis();
    const windowSeconds = Math.ceil(options.windowMs / 1000);

    if (redis) {
      try {
        const count = await redis.incr(key);
        if (count === 1) await redis.expire(key, windowSeconds);
        if (count > options.max) {
          return res.status(429).json({ error: "Too many requests. Please try again later.", code: "RATE_LIMITED" });
        }
        return next();
      } catch {
        return memoryLimit(key, options, res, next);
      }
    }

    return memoryLimit(key, options, res, next);
  };
}

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyPrefix: "api",
  keyGenerator: (req) => (req as Request & { user?: { id: string } }).user?.id || req.ip || "anonymous"
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyPrefix: "auth"
});

export const otpRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  keyPrefix: "otp",
  keyGenerator: (req) => String(req.body?.phone || req.ip || "anonymous")
});

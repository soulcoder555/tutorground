import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(400).json({
    error: result.array()[0]?.msg || "Validation failed",
    code: "VALIDATION_ERROR",
    details: result.array()
  });
}


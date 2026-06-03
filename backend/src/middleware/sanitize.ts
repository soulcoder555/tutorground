import type { NextFunction, Request, Response } from "express";
import { sanitizePayload } from "../utils/sanitize";

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction) {
  req.body = sanitizePayload(req.body);
  req.query = sanitizePayload(req.query);
  req.params = sanitizePayload(req.params);
  next();
}


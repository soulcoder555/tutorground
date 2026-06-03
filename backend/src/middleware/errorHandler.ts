import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError";
import { isProduction } from "../config/env";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found`, code: "NOT_FOUND" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (!isProduction) {
    console.error(error);
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ error: error.message, code: error.code });
  }

  const prismaCode = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : undefined;
  const errorName = error instanceof Error ? error.name : "";
  const errorMessage = error instanceof Error ? error.message : "";
  const databaseUnavailable =
    prismaCode === "P1001" ||
    errorName === "PrismaClientInitializationError" ||
    errorMessage.includes("Can't reach database server") ||
    errorMessage.includes("ECONNREFUSED");

  if (databaseUnavailable) {
    return res.status(503).json({
      error: "Database is not reachable. Please start TutorGround database services and try again.",
      code: "DATABASE_UNAVAILABLE"
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "A record with this value already exists", code: "CONFLICT" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Resource not found", code: "NOT_FOUND" });
    }
  }

  return res.status(500).json({ error: "Something went wrong. Please try again.", code: "INTERNAL_SERVER_ERROR" });
}

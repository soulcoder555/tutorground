import { Router } from "express";
import { body } from "express-validator";
import {
  createSession,
  deleteSession,
  endSession,
  getSession,
  joinSession,
  startSession,
  updateSession
} from "../controllers/sessionController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";

export const sessionsRouter = Router();

sessionsRouter.post(
  "/",
  requireAuth,
  requireRole("TUTOR"),
  [
    body("studentIds").isArray({ min: 1 }),
    body("subject").notEmpty(),
    body("classLevel").notEmpty(),
    body("scheduledAt").isISO8601().custom((value) => new Date(value) > new Date()).withMessage("scheduledAt must be in the future"),
    body("durationMins").isInt({ min: 15, max: 240 }),
    body("mode").isIn(["ONLINE", "OFFLINE", "BOTH"])
  ],
  validateRequest,
  createSession
);
sessionsRouter.get("/:id", requireAuth, getSession);
sessionsRouter.put("/:id", requireAuth, requireRole("TUTOR"), updateSession);
sessionsRouter.delete("/:id", requireAuth, requireRole("TUTOR"), deleteSession);
sessionsRouter.post("/:id/start", requireAuth, requireRole("TUTOR"), startSession);
sessionsRouter.post(
  "/:id/end",
  requireAuth,
  requireRole("TUTOR"),
  [body("topicsCovered").notEmpty(), body("homeworkAssigned").isBoolean(), body("studentActivityLevel").isIn(["LOW", "MEDIUM", "HIGH", "EXCELLENT"])],
  validateRequest,
  endSession
);
sessionsRouter.get("/:id/join", requireAuth, joinSession);


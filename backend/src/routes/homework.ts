import { Router } from "express";
import { body } from "express-validator";
import {
  createHomework,
  deleteHomework,
  getHomework,
  getHomeworkSubmissions,
  getSessionHomework,
  reviewSubmission,
  submitHomework,
  updateHomework
} from "../controllers/homeworkController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { upload } from "../middleware/upload";
import { validateRequest } from "../middleware/validate";

export const homeworkRouter = Router();

function parseStudentIds(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : value.split(",").map((item) => item.trim()).filter(Boolean);
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

homeworkRouter.post(
  "/",
  requireAuth,
  requireRole("TUTOR"),
  upload.single("file"),
  [body("sessionId").notEmpty(), body("studentIds").customSanitizer(parseStudentIds).isArray({ min: 1 }), body("title").notEmpty(), body("dueDate").isISO8601().custom((value) => new Date(value) > new Date()).withMessage("dueDate must be in the future")],
  validateRequest,
  createHomework
);
homeworkRouter.get("/session/:sessionId", requireAuth, getSessionHomework);
homeworkRouter.put("/submissions/:id/review", requireAuth, requireRole("TUTOR"), [body("score").isInt({ min: 0, max: 100 })], validateRequest, reviewSubmission);
homeworkRouter.post("/:id/submit", requireAuth, requireRole("STUDENT"), upload.single("file"), submitHomework);
homeworkRouter.get("/:id/submissions", requireAuth, requireRole("TUTOR"), getHomeworkSubmissions);
homeworkRouter.get("/:id", requireAuth, getHomework);
homeworkRouter.put("/:id", requireAuth, requireRole("TUTOR"), updateHomework);
homeworkRouter.delete("/:id", requireAuth, requireRole("TUTOR"), deleteHomework);

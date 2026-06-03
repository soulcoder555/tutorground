import { Router } from "express";
import { body } from "express-validator";
import { getSessionAttendance, getStudentAttendanceById, markAttendanceController } from "../controllers/attendanceController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";

export const attendanceRouter = Router();

attendanceRouter.post(
  "/:sessionId/mark",
  requireAuth,
  requireRole("TUTOR"),
  [body("studentId").notEmpty(), body("status").isIn(["PRESENT", "ABSENT", "LATE"])],
  validateRequest,
  markAttendanceController
);
attendanceRouter.get("/student/:studentId", requireAuth, getStudentAttendanceById);
attendanceRouter.get("/:sessionId", requireAuth, getSessionAttendance);

import { Router } from "express";
import { body } from "express-validator";
import {
  getLearningPassport,
  getStudentAttendance,
  getStudentHomework,
  getStudentProfile,
  linkParentFromStudent,
  updateStudentProfile
} from "../controllers/studentController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";

export const studentsRouter = Router();
const studentOnly = [requireAuth, requireRole("STUDENT")];

studentsRouter.get("/profile", studentOnly, getStudentProfile);
studentsRouter.put(
  "/profile",
  studentOnly,
  [body("class").notEmpty(), body("subjects").isArray({ min: 1 }), body("latitude").optional().isFloat({ min: -90, max: 90 }), body("longitude").optional().isFloat({ min: -180, max: 180 })],
  validateRequest,
  updateStudentProfile
);
studentsRouter.get("/passport", studentOnly, getLearningPassport);
studentsRouter.post("/link-parent", studentOnly, [body("linkCode").notEmpty()], validateRequest, linkParentFromStudent);
studentsRouter.get("/homework", studentOnly, getStudentHomework);
studentsRouter.get("/attendance", studentOnly, getStudentAttendance);


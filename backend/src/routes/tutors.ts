import { Router } from "express";
import { body } from "express-validator";
import {
  getPublicTutorProfile,
  getTutorEarnings,
  getTutorProfile,
  getTutorSessions,
  getTutorStudents,
  setAvailability,
  updateTutorProfile,
  uploadTutorDocuments
} from "../controllers/tutorController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { upload } from "../middleware/upload";
import { validateRequest } from "../middleware/validate";

export const tutorsRouter = Router();

const tutorOnly = [requireAuth, requireRole("TUTOR")];

tutorsRouter.get("/profile", tutorOnly, getTutorProfile);
tutorsRouter.put(
  "/profile",
  tutorOnly,
  [
    body("bio").isLength({ min: 10 }),
    body("subjects").isArray({ min: 1 }),
    body("classesTeaching").isArray({ min: 1 }),
    body("hourlyRate").isFloat({ min: 1, max: 10000 }),
    body("teachingMode").isIn(["ONLINE", "OFFLINE", "BOTH"]),
    body("experienceYears").isInt({ min: 0, max: 50 }),
    body("latitude").isFloat({ min: -90, max: 90 }),
    body("longitude").isFloat({ min: -180, max: 180 }),
    body("profileUrl").isSlug()
  ],
  validateRequest,
  updateTutorProfile
);
tutorsRouter.post("/availability", tutorOnly, [body("slots").isArray()], validateRequest, setAvailability);
tutorsRouter.get("/students", tutorOnly, getTutorStudents);
tutorsRouter.get("/sessions", tutorOnly, getTutorSessions);
tutorsRouter.get("/earnings", tutorOnly, getTutorEarnings);
tutorsRouter.post(
  "/documents",
  tutorOnly,
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  uploadTutorDocuments
);
tutorsRouter.get("/:profileUrl", getPublicTutorProfile);


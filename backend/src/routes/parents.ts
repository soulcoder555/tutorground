import { Router } from "express";
import { body } from "express-validator";
import {
  createParentBooking,
  getChildren,
  getParentBookings,
  getParentProfile,
  linkStudent,
  parentProofCards,
  trustDashboard,
  updateParentProfile
} from "../controllers/parentController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";

export const parentsRouter = Router();
const parentOnly = [requireAuth, requireRole("PARENT")];

parentsRouter.get("/profile", parentOnly, getParentProfile);
parentsRouter.put(
  "/profile",
  parentOnly,
  [body("latitude").isFloat({ min: -90, max: 90 }), body("longitude").isFloat({ min: -180, max: 180 }), body("address").notEmpty(), body("city").notEmpty()],
  validateRequest,
  updateParentProfile
);
parentsRouter.get("/children", parentOnly, getChildren);
parentsRouter.post("/link-student", parentOnly, [body("linkCode").notEmpty()], validateRequest, linkStudent);
parentsRouter.get("/trust-dashboard/:studentId", parentOnly, trustDashboard);
parentsRouter.get("/proof-cards", parentOnly, parentProofCards);
parentsRouter.post(
  "/bookings",
  parentOnly,
  [body("tutorId").notEmpty(), body("studentId").notEmpty(), body("subject").notEmpty(), body("classLevel").notEmpty(), body("mode").isIn(["ONLINE", "OFFLINE", "BOTH"]), body("preferredTime").notEmpty()],
  validateRequest,
  createParentBooking
);
parentsRouter.get("/bookings", parentOnly, getParentBookings);


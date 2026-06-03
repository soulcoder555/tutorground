import { Router } from "express";
import { body } from "express-validator";
import { createReview, deleteReview, getTutorReviews } from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";

export const reviewsRouter = Router();

reviewsRouter.post(
  "/",
  requireAuth,
  requireRole("PARENT"),
  [body("tutorId").notEmpty(), body("studentId").notEmpty(), body("rating").isFloat({ min: 1, max: 5 }), body("writtenReview").isLength({ min: 10 })],
  validateRequest,
  createReview
);
reviewsRouter.get("/tutor/:tutorId", getTutorReviews);
reviewsRouter.delete("/:id", requireAuth, requireRole("ADMIN"), deleteReview);


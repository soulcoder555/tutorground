import { Router } from "express";
import { body } from "express-validator";
import { generateProofCardController, getProofCardBySession, getProofCardsForParent } from "../controllers/proofCardController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";

export const proofCardsRouter = Router();

proofCardsRouter.post(
  "/generate/:sessionId",
  requireAuth,
  requireRole("TUTOR"),
  [body("topicsCovered").notEmpty(), body("homeworkAssigned").isBoolean(), body("studentActivityLevel").isIn(["LOW", "MEDIUM", "HIGH", "EXCELLENT"])],
  validateRequest,
  generateProofCardController
);
proofCardsRouter.get("/parent/:parentId", requireAuth, getProofCardsForParent);
proofCardsRouter.get("/:sessionId", requireAuth, getProofCardBySession);


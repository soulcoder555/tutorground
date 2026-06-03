import { Router } from "express";
import { body } from "express-validator";
import { adminAnalytics, adminSessions, adminUsers, deleteUser, pendingTutors, verifyTutor } from "../controllers/adminController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("ADMIN"));
adminRouter.get("/tutors/pending", pendingTutors);
adminRouter.post("/tutors/:id/verify", [body("status").isIn(["APPROVED", "REJECTED"]), body("notes").optional().isString()], validateRequest, verifyTutor);
adminRouter.get("/users", adminUsers);
adminRouter.delete("/users/:id", deleteUser);
adminRouter.get("/analytics", adminAnalytics);
adminRouter.get("/sessions", adminSessions);


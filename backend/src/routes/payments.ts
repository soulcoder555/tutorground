import { Router } from "express";
import { requireAuth } from "../middleware/auth";

export const paymentsRouter = Router();

paymentsRouter.post("/razorpay/create-order", requireAuth, (_req, res) => {
  res.status(501).json({
    error: "Razorpay payments are scaffolded for Phase 2. Add keys and enable the payment service before launch.",
    code: "PAYMENTS_PHASE_2"
  });
});


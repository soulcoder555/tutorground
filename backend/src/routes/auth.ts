import { Router } from "express";
import { body } from "express-validator";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  refreshController,
  resetPasswordController,
  sendOtpController,
  signupController,
  verifyOtpController
} from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { authRateLimit, otpRateLimit } from "../middleware/rateLimit";
import { validateRequest } from "../middleware/validate";

export const authRouter = Router();

const phoneRule = body("phone").matches(/^[6-9]\d{9}$/).withMessage("Phone must be a valid Indian mobile number");
const passwordRule = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must include one uppercase letter")
  .matches(/\d/)
  .withMessage("Password must include one number");

authRouter.post(
  "/signup",
  authRateLimit,
  [
    body("name").isLength({ min: 2, max: 50 }),
    body("email").isEmail().normalizeEmail(),
    passwordRule,
    body("role").isIn(["TUTOR", "STUDENT", "PARENT", "ADMIN"])
  ],
  validateRequest,
  signupController
);

authRouter.post("/login", authRateLimit, [body("email").isEmail(), body("password").notEmpty()], validateRequest, loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/refresh", refreshController);
authRouter.post("/send-otp", otpRateLimit, [phoneRule], validateRequest, sendOtpController);
authRouter.post("/verify-otp", otpRateLimit, [phoneRule, body("otp").isLength({ min: 6, max: 6 })], validateRequest, verifyOtpController);
authRouter.get("/me", requireAuth, meController);
authRouter.post("/forgot-password", authRateLimit, [body("email").isEmail()], validateRequest, forgotPasswordController);
authRouter.post("/reset-password", authRateLimit, [body("token").notEmpty(), passwordRule], validateRequest, resetPasswordController);

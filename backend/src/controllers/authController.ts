import type { Response } from "express";
import type { AuthenticatedRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import {
  authCookieOptions,
  createPasswordReset,
  login,
  logout,
  resetPassword,
  rotateRefreshToken,
  sendOtp,
  signup,
  verifyOtp
} from "../services/authService";
import { getPrisma } from "../prisma";

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, authCookieOptions.access);
  res.cookie("refreshToken", refreshToken, authCookieOptions.refresh);
}

function clearAuthCookies(res: Response) {
  const { maxAge: _accessMaxAge, ...accessOptions } = authCookieOptions.access;
  const { maxAge: _refreshMaxAge, ...refreshOptions } = authCookieOptions.refresh;
  res.clearCookie("accessToken", accessOptions);
  res.clearCookie("refreshToken", refreshOptions);
}

function hideInternalPhone<T extends { phone: string | null }>(user: T | null) {
  if (!user) return null;
  return {
    ...user,
    phone: user.phone?.startsWith("email-only:") ? null : user.phone
  };
}

export const signupController = asyncHandler(async (req, res) => {
  const user = await signup(req.body);
  res.status(201).json({ data: { user } });
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await login(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ data: result });
});

export const logoutController = asyncHandler(async (req, res) => {
  await logout(req.cookies?.refreshToken || req.body?.refreshToken);
  clearAuthCookies(res);
  res.json({ data: { loggedOut: true } });
});

export const refreshController = asyncHandler(async (req, res) => {
  const result = await rotateRefreshToken(req.cookies?.refreshToken || req.body?.refreshToken);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ data: result });
});

export const sendOtpController = asyncHandler(async (req, res) => {
  const result = await sendOtp(req.body.phone);
  res.json({ data: result });
});

export const verifyOtpController = asyncHandler(async (req, res) => {
  const result = await verifyOtp(req.body.phone, req.body.otp);
  res.json({ data: result });
});

export const meController = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await getPrisma().user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
      tutorProfile: true,
      studentProfile: true,
      parentProfile: true
    }
  });
  res.json({ data: { user: hideInternalPhone(user) } });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  res.json({ data: await createPasswordReset(req.body.email) });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  res.json({ data: await resetPassword(req.body.token, req.body.password) });
});

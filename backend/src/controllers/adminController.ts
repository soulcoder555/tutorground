import type { VerificationStatus } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { getPrisma } from "../prisma";
import { notFound } from "../utils/apiError";
import { createNotification } from "../services/notificationService";

export const pendingTutors = asyncHandler(async (_req, res) => {
  const tutors = await getPrisma().tutorVerification.findMany({
    where: { status: "PENDING" },
    include: { tutor: { include: { user: true } } },
    orderBy: { createdAt: "asc" }
  });
  res.json({ data: { tutors } });
});

export const verifyTutor = asyncHandler(async (req, res) => {
  const status = req.body.status as VerificationStatus;
  const verification = await getPrisma().tutorVerification.update({
    where: { tutorId: req.params.id },
    data: {
      status,
      adminNotes: req.body.notes,
      verifiedAt: status === "APPROVED" ? new Date() : null,
      verifiedBy: req.body.verifiedBy || "admin"
    },
    include: { tutor: true }
  });
  await getPrisma().tutorProfile.update({
    where: { id: req.params.id },
    data: { verificationLevel: status === "APPROVED" ? 3 : 0 }
  });
  await createNotification({
    userId: verification.tutor.userId,
    type: "tutor:verification",
    title: status === "APPROVED" ? "Tutor verification approved" : "Tutor verification needs attention",
    body: req.body.notes || `Your verification was ${status.toLowerCase()}.`,
    data: { status, tutorId: req.params.id }
  });
  res.json({ data: { verification } });
});

export const adminUsers = asyncHandler(async (req, res) => {
  const users = await getPrisma().user.findMany({
    where: { role: req.query.role as never },
    select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 200
  });
  res.json({ data: { users } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await getPrisma().user.findUnique({ where: { id: req.params.id } });
  if (!user) throw notFound("User not found");
  await getPrisma().user.update({ where: { id: user.id }, data: { isActive: false } });
  res.json({ data: { deleted: true } });
});

export const adminAnalytics = asyncHandler(async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [totalUsers, tutors, parents, students, sessionsToday, pendingVerifications, completedSessions, earnings] = await Promise.all([
    getPrisma().user.count(),
    getPrisma().tutorProfile.count(),
    getPrisma().parentProfile.count(),
    getPrisma().studentProfile.count(),
    getPrisma().session.count({ where: { scheduledAt: { gte: today } } }),
    getPrisma().tutorVerification.count({ where: { status: "PENDING" } }),
    getPrisma().session.count({ where: { status: "COMPLETED" } }),
    getPrisma().earning.aggregate({ _sum: { amount: true, platformFee: true } })
  ]);
  res.json({
    data: {
      totalUsers,
      tutors,
      parents,
      students,
      sessionsToday,
      pendingVerifications,
      completedSessions,
      revenue: earnings._sum.amount || 0,
      platformFees: earnings._sum.platformFee || 0,
      health: { api: "ok", database: "ok", realtime: "ok" }
    }
  });
});

export const adminSessions = asyncHandler(async (_req, res) => {
  const sessions = await getPrisma().session.findMany({
    include: { tutor: { include: { user: true } }, attendance: true },
    orderBy: { scheduledAt: "desc" },
    take: 200
  });
  res.json({ data: { sessions } });
});


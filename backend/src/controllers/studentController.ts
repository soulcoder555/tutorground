import crypto from "crypto";
import type { AuthenticatedRequest } from "../types";
import { getPrisma } from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { notFound } from "../utils/apiError";

function newLinkCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

async function ownStudent(userId: string) {
  const student = await getPrisma().studentProfile.findUnique({ where: { userId } });
  if (!student) throw notFound("Student profile not found");
  return student;
}

export const getStudentProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const profile = await getPrisma().studentProfile.findUnique({ where: { userId: req.user!.id }, include: { user: true, parent: true } });
  res.json({ data: { profile } });
});

export const updateStudentProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const profile = await getPrisma().studentProfile.upsert({
    where: { userId: req.user!.id },
    create: {
      userId: req.user!.id,
      class: req.body.class,
      subjects: req.body.subjects,
      linkCode: newLinkCode(),
      latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
      longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
      city: req.body.city
    },
    update: {
      class: req.body.class,
      subjects: req.body.subjects,
      latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
      longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
      city: req.body.city
    }
  });
  res.json({ data: { profile } });
});

export const getLearningPassport = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const student = await ownStudent(req.user!.id);
  const passport = await getPrisma().learningPassport.upsert({
    where: { studentId: student.id },
    create: { studentId: student.id, strongTopics: [], weakTopics: [], subjectsStudied: [], achievements: [], teachersHistory: [] },
    update: {}
  });
  res.json({ data: { passport } });
});

export const linkParentFromStudent = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const student = await ownStudent(req.user!.id);
  const parent = await getPrisma().parentProfile.findFirst({
    where: { OR: [{ id: req.body.parentId }, { user: { phone: req.body.linkCode } }] }
  });
  if (!parent) throw notFound("Parent profile not found");
  const updated = await getPrisma().studentProfile.update({ where: { id: student.id }, data: { parentId: parent.id } });
  await getPrisma().parentProfile.update({ where: { id: parent.id }, data: { studentIds: { push: student.id } } });
  res.json({ data: { profile: updated } });
});

export const getStudentHomework = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const student = await ownStudent(req.user!.id);
  const homework = await getPrisma().homework.findMany({
    where: { studentIds: { has: student.id } },
    include: { submissions: { where: { studentId: student.id } }, session: true },
    orderBy: { dueDate: "asc" }
  });
  res.json({ data: { homework } });
});

export const getStudentAttendance = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const student = await ownStudent(req.user!.id);
  const attendance = await getPrisma().attendance.findMany({
    where: { studentId: student.id },
    include: { session: true },
    orderBy: { markedAt: "desc" }
  });
  const present = attendance.filter((item) => item.status === "PRESENT").length;
  const percentage = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  res.json({ data: { attendance, percentage } });
});


import type { AuthenticatedRequest } from "../types";
import { getPrisma } from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { forbidden, notFound } from "../utils/apiError";
import { createNotifications } from "../services/notificationService";
import { emitToSession } from "../socket";
import { generateProofCard } from "../services/proofCardService";

async function ownTutor(userId: string) {
  const tutor = await getPrisma().tutorProfile.findUnique({ where: { userId } });
  if (!tutor) throw notFound("Tutor profile not found");
  return tutor;
}

async function canAccessSession(req: AuthenticatedRequest, sessionId: string) {
  const prisma = getPrisma();
  const session = await prisma.session.findUnique({ where: { id: sessionId }, include: { tutor: true } });
  if (!session) throw notFound("Session not found");
  if (req.user!.role === "ADMIN") return session;
  if (req.user!.role === "TUTOR" && session.tutor.userId === req.user!.id) return session;
  if (req.user!.role === "STUDENT") {
    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user!.id } });
    if (student && session.studentIds.includes(student.id)) return session;
  }
  if (req.user!.role === "PARENT") {
    const parent = await prisma.parentProfile.findUnique({ where: { userId: req.user!.id } });
    if (parent?.studentIds.some((id) => session.studentIds.includes(id))) return session;
  }
  throw forbidden();
}

export const createSession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const session = await getPrisma().session.create({
    data: {
      tutorId: tutor.id,
      studentIds: req.body.studentIds,
      subject: req.body.subject,
      classLevel: req.body.classLevel,
      scheduledAt: new Date(req.body.scheduledAt),
      durationMins: Number(req.body.durationMins),
      mode: req.body.mode,
      isRecurring: Boolean(req.body.isRecurring),
      recurringPattern: req.body.recurringPattern,
      sessionType: req.body.sessionType || "ONE_ON_ONE"
    }
  });
  res.status(201).json({ data: { session } });
});

export const getSession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  await canAccessSession(req, req.params.id);
  const session = await getPrisma().session.findUnique({
    where: { id: req.params.id },
    include: { tutor: { include: { user: true } }, attendance: true, homework: true, proofCard: true }
  });
  res.json({ data: { session } });
});

export const updateSession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const session = await getPrisma().session.findUnique({ where: { id: req.params.id } });
  if (!session) throw notFound("Session not found");
  if (session.tutorId !== tutor.id) throw forbidden();
  const updated = await getPrisma().session.update({
    where: { id: session.id },
    data: {
      studentIds: req.body.studentIds,
      subject: req.body.subject,
      classLevel: req.body.classLevel,
      scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined,
      durationMins: req.body.durationMins ? Number(req.body.durationMins) : undefined,
      mode: req.body.mode,
      status: req.body.status,
      recurringPattern: req.body.recurringPattern
    }
  });
  res.json({ data: { session: updated } });
});

export const deleteSession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const session = await getPrisma().session.findUnique({ where: { id: req.params.id } });
  if (!session) throw notFound("Session not found");
  if (session.tutorId !== tutor.id) throw forbidden();
  await getPrisma().session.delete({ where: { id: session.id } });
  res.json({ data: { deleted: true } });
});

export const startSession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const session = await getPrisma().session.findUnique({
    where: { id: req.params.id },
    include: { tutor: { include: { user: true } } }
  });
  if (!session) throw notFound("Session not found");
  if (session.tutorId !== tutor.id) throw forbidden();

  const jitsiRoomId = `tutorground-${session.id}`;
  const meetingLink = `https://meet.jit.si/${jitsiRoomId}`;
  const updated = await getPrisma().session.update({
    where: { id: session.id },
    data: { status: "LIVE", actualStartTime: new Date(), jitsiRoomId, meetingLink }
  });

  const students = await getPrisma().studentProfile.findMany({
    where: { id: { in: session.studentIds } },
    include: { user: true, parent: { include: { user: true } } }
  });
  const userIds = Array.from(new Set(students.flatMap((student) => [student.userId, student.parent?.userId]).filter(Boolean) as string[]));
  await createNotifications(
    userIds.map((userId) => ({
      userId,
      type: "session:started",
      title: "Class started",
      body: `${session.tutor.user.name} started ${session.subject}.`,
      data: { sessionId: session.id, tutorName: session.tutor.user.name, subject: session.subject, meetingLink }
    }))
  );
  emitToSession(session.id, "session:started", { sessionId: session.id, tutorName: session.tutor.user.name, subject: session.subject, meetingLink });
  res.json({ data: { session: updated } });
});

export const endSession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const session = await getPrisma().session.findUnique({ where: { id: req.params.id } });
  if (!session) throw notFound("Session not found");
  if (session.tutorId !== tutor.id) throw forbidden();
  const updated = await getPrisma().session.update({
    where: { id: session.id },
    data: { status: "COMPLETED", actualEndTime: new Date() }
  });
  const proofCard = await generateProofCard(session.id, tutor.id, req.body);
  emitToSession(session.id, "session:ended", { sessionId: session.id, proofCardId: proofCard.id });
  res.json({ data: { session: updated, proofCard } });
});

export const joinSession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = await canAccessSession(req, req.params.id);
  const meetingLink = session.meetingLink || `https://meet.jit.si/tutorground-${session.id}`;
  res.json({ data: { meetingLink, jitsiRoomId: session.jitsiRoomId || `tutorground-${session.id}` } });
});


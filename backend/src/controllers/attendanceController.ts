import type { AuthenticatedRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { getPrisma } from "../prisma";
import { forbidden, notFound } from "../utils/apiError";
import { markAttendance } from "../services/attendanceService";

async function ownTutor(userId: string) {
  const tutor = await getPrisma().tutorProfile.findUnique({ where: { userId } });
  if (!tutor) throw notFound("Tutor profile not found");
  return tutor;
}

export const markAttendanceController = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const attendance = await markAttendance({
    sessionId: req.params.sessionId,
    tutorId: tutor.id,
    studentId: req.body.studentId,
    status: req.body.status,
    note: req.body.note
  });
  res.json({ data: { attendance } });
});

export const getSessionAttendance = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = await getPrisma().session.findUnique({ where: { id: req.params.sessionId }, include: { tutor: true } });
  if (!session) throw notFound("Session not found");
  if (req.user!.role === "TUTOR" && session.tutor.userId !== req.user!.id) throw forbidden();
  const attendance = await getPrisma().attendance.findMany({
    where: { sessionId: req.params.sessionId },
    include: { student: { include: { user: true } } }
  });
  res.json({ data: { attendance } });
});

export const getStudentAttendanceById = asyncHandler(async (req: AuthenticatedRequest, res) => {
  if (req.user!.role === "STUDENT") {
    const student = await getPrisma().studentProfile.findUnique({ where: { userId: req.user!.id } });
    if (!student || student.id !== req.params.studentId) throw forbidden();
  }
  if (req.user!.role === "PARENT") {
    const parent = await getPrisma().parentProfile.findUnique({ where: { userId: req.user!.id } });
    if (!parent?.studentIds.includes(req.params.studentId)) throw forbidden();
  }
  const attendance = await getPrisma().attendance.findMany({
    where: { studentId: req.params.studentId },
    include: { session: true },
    orderBy: { markedAt: "desc" }
  });
  res.json({ data: { attendance } });
});


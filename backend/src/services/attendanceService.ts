import type { AttendanceStatus } from "@prisma/client";
import { getPrisma } from "../prisma";
import { forbidden, notFound } from "../utils/apiError";
import { createNotification } from "./notificationService";
import { emitToSession } from "../socket";

export async function markAttendance(input: {
  sessionId: string;
  tutorId: string;
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}) {
  const prisma = getPrisma();
  const session = await prisma.session.findUnique({ where: { id: input.sessionId } });
  if (!session) throw notFound("Session not found");
  if (session.tutorId !== input.tutorId) throw forbidden();
  if (!session.studentIds.includes(input.studentId)) throw forbidden("Student is not part of this session");

  const attendance = await prisma.attendance.upsert({
    where: { sessionId_studentId: { sessionId: input.sessionId, studentId: input.studentId } },
    create: {
      sessionId: input.sessionId,
      tutorId: input.tutorId,
      studentId: input.studentId,
      status: input.status,
      note: input.note
    },
    update: {
      status: input.status,
      note: input.note,
      markedAt: new Date()
    },
    include: { student: { include: { user: true, parent: { include: { user: true } } } } }
  });

  if (attendance.student.parent?.userId) {
    await createNotification({
      userId: attendance.student.parent.userId,
      type: "attendance:marked",
      title: "Attendance marked",
      body: `${attendance.student.user.name} was marked ${input.status.toLowerCase()}.`,
      data: { sessionId: input.sessionId, studentId: input.studentId, status: input.status }
    });
  }

  emitToSession(input.sessionId, "attendance:marked", {
    studentName: attendance.student.user.name,
    status: input.status,
    sessionId: input.sessionId,
    timestamp: attendance.markedAt
  });
  return attendance;
}


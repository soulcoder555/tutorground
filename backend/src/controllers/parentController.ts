import type { AuthenticatedRequest } from "../types";
import { getPrisma } from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { forbidden, notFound } from "../utils/apiError";
import { createNotification } from "../services/notificationService";

async function ownParent(userId: string) {
  const parent = await getPrisma().parentProfile.findUnique({ where: { userId } });
  if (!parent) throw notFound("Parent profile not found");
  return parent;
}

export const getParentProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const profile = await getPrisma().parentProfile.findUnique({
    where: { userId: req.user!.id },
    include: { user: true, children: { include: { user: true } } }
  });
  res.json({ data: { profile } });
});

export const updateParentProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const profile = await getPrisma().parentProfile.upsert({
    where: { userId: req.user!.id },
    create: {
      userId: req.user!.id,
      studentIds: [],
      latitude: Number(req.body.latitude),
      longitude: Number(req.body.longitude),
      address: req.body.address,
      city: req.body.city
    },
    update: {
      latitude: Number(req.body.latitude),
      longitude: Number(req.body.longitude),
      address: req.body.address,
      city: req.body.city
    }
  });
  res.json({ data: { profile } });
});

export const getChildren = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parent = await ownParent(req.user!.id);
  const children = await getPrisma().studentProfile.findMany({
    where: { OR: [{ parentId: parent.id }, { id: { in: parent.studentIds } }] },
    include: { user: true, passport: true }
  });
  res.json({ data: { children } });
});

export const linkStudent = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parent = await ownParent(req.user!.id);
  const student = await getPrisma().studentProfile.findUnique({ where: { linkCode: req.body.linkCode }, include: { user: true } });
  if (!student) throw notFound("Student link code not found");
  const updated = await getPrisma().studentProfile.update({ where: { id: student.id }, data: { parentId: parent.id } });
  if (!parent.studentIds.includes(student.id)) {
    await getPrisma().parentProfile.update({ where: { id: parent.id }, data: { studentIds: { push: student.id } } });
  }
  res.json({ data: { student: updated } });
});

export const trustDashboard = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parent = await ownParent(req.user!.id);
  const studentId = req.params.studentId;
  if (!parent.studentIds.includes(studentId)) {
    const linked = await getPrisma().studentProfile.findFirst({ where: { id: studentId, parentId: parent.id } });
    if (!linked) throw forbidden();
  }

  const [student, attendance, homework, proofCards] = await Promise.all([
    getPrisma().studentProfile.findUnique({ where: { id: studentId }, include: { user: true, passport: true } }),
    getPrisma().attendance.findMany({ where: { studentId }, include: { session: true }, orderBy: { markedAt: "desc" } }),
    getPrisma().homework.findMany({ where: { studentIds: { has: studentId } }, include: { submissions: { where: { studentId } }, session: true } }),
    getPrisma().teachingProofCard.findMany({ where: { parentIds: { has: parent.id } }, include: { session: true, tutor: { include: { user: true } } }, orderBy: { generatedAt: "desc" } })
  ]);
  if (!student) throw notFound("Student not found");

  const childProofCards = proofCards.filter((card) => card.session.studentIds.includes(studentId));
  const presentCount = attendance.filter((item) => item.status === "PRESENT").length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
  const submittedCount = homework.filter((item) => item.submissions.length > 0).length;
  const homeworkCompletionRate = homework.length ? Math.round((submittedCount / homework.length) * 100) : 0;
  const punctualityScore = Math.round(
    childProofCards.reduce((sum, card) => sum + card.tutor.punctualityScore, 0) / Math.max(1, childProofCards.length)
  );
  const qualityScore = Math.round((attendanceRate + homeworkCompletionRate + punctualityScore) / 3);
  const topics = childProofCards.map((card) => ({
    date: card.generatedAt,
    subject: card.session.subject,
    topicsCovered: card.topicsCovered,
    tutorName: card.tutor.user.name
  }));
  const summary = `${student.user.name} attended ${presentCount} out of ${attendance.length} classes this month. Topics covered: ${topics
    .slice(0, 5)
    .map((topic) => topic.topicsCovered)
    .join(", ") || "not available yet"}. Homework completion: ${homeworkCompletionRate}%. Tutor was on time ${punctualityScore}% of sessions.`;

  res.json({
    data: {
      student,
      overview: { punctualityScore, attendanceRate, homeworkCompletionRate, qualityScore },
      attendance,
      homework,
      proofCards: childProofCards.slice(0, 5),
      topics,
      monthlySummary: summary
    }
  });
});

export const parentProofCards = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parent = await ownParent(req.user!.id);
  const proofCards = await getPrisma().teachingProofCard.findMany({
    where: { parentIds: { has: parent.id } },
    include: { session: true, tutor: { include: { user: true } } },
    orderBy: { generatedAt: "desc" }
  });
  res.json({ data: { proofCards } });
});

export const createParentBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parent = await ownParent(req.user!.id);
  if (!parent.studentIds.includes(req.body.studentId)) throw forbidden("This student is not linked to your account");
  const booking = await getPrisma().booking.create({
    data: {
      tutorId: req.body.tutorId,
      parentId: parent.id,
      studentId: req.body.studentId,
      subject: req.body.subject,
      classLevel: req.body.classLevel,
      mode: req.body.mode,
      preferredTime: req.body.preferredTime,
      message: req.body.message
    },
    include: { tutor: { include: { user: true } }, parent: { include: { user: true } } }
  });
  await createNotification({
    userId: booking.tutor.userId,
    type: "booking:received",
    title: "New booking request",
    body: `${booking.parent.user.name} requested ${booking.subject} tutoring.`,
    data: { bookingId: booking.id, parentName: booking.parent.user.name, subject: booking.subject, preferredTime: booking.preferredTime }
  });
  res.status(201).json({ data: { booking } });
});

export const getParentBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parent = await ownParent(req.user!.id);
  const bookings = await getPrisma().booking.findMany({
    where: { parentId: parent.id },
    include: { tutor: { include: { user: true } }, student: { include: { user: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ data: { bookings } });
});

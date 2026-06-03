import type { AuthenticatedRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { getPrisma } from "../prisma";
import { forbidden, notFound } from "../utils/apiError";
import { uploadFile } from "../services/uploadService";
import { createNotifications, createNotification } from "../services/notificationService";
import { updatePassportAfterHomeworkReview } from "../services/learningPassportService";

async function ownTutor(userId: string) {
  const tutor = await getPrisma().tutorProfile.findUnique({ where: { userId } });
  if (!tutor) throw notFound("Tutor profile not found");
  return tutor;
}

async function ownStudent(userId: string) {
  const student = await getPrisma().studentProfile.findUnique({ where: { userId } });
  if (!student) throw notFound("Student profile not found");
  return student;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

export const createHomework = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const fileUrl = req.file ? await uploadFile(req.file, "homework") : undefined;
  const session = await getPrisma().session.findUnique({ where: { id: req.body.sessionId } });
  if (!session || session.tutorId !== tutor.id) throw forbidden();
  const studentIds = asStringArray(req.body.studentIds);
  const homework = await getPrisma().homework.create({
    data: {
      sessionId: req.body.sessionId,
      tutorId: tutor.id,
      studentIds,
      title: req.body.title,
      description: req.body.description,
      dueDate: new Date(req.body.dueDate),
      fileUrl
    }
  });
  const students = await getPrisma().studentProfile.findMany({
    where: { id: { in: studentIds } },
    include: { user: true, parent: { include: { user: true } } }
  });
  const userIds = Array.from(new Set(students.flatMap((student) => [student.userId, student.parent?.userId]).filter(Boolean) as string[]));
  await createNotifications(
    userIds.map((userId) => ({
      userId,
      type: "homework:assigned",
      title: "Homework assigned",
      body: `${req.user!.name} assigned ${homework.title}.`,
      data: { homeworkId: homework.id, title: homework.title, dueDate: homework.dueDate, subject: session.subject }
    }))
  );
  res.status(201).json({ data: { homework } });
});

export const getHomework = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const homework = await getPrisma().homework.findUnique({ where: { id: req.params.id }, include: { submissions: true, session: true } });
  if (!homework) throw notFound("Homework not found");
  res.json({ data: { homework } });
});

export const updateHomework = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const homework = await getPrisma().homework.findUnique({ where: { id: req.params.id } });
  if (!homework || homework.tutorId !== tutor.id) throw forbidden();
  const updated = await getPrisma().homework.update({
    where: { id: homework.id },
    data: {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      studentIds: req.body.studentIds
    }
  });
  res.json({ data: { homework: updated } });
});

export const deleteHomework = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const homework = await getPrisma().homework.findUnique({ where: { id: req.params.id } });
  if (!homework || homework.tutorId !== tutor.id) throw forbidden();
  await getPrisma().homework.delete({ where: { id: homework.id } });
  res.json({ data: { deleted: true } });
});

export const getSessionHomework = asyncHandler(async (req, res) => {
  const homework = await getPrisma().homework.findMany({ where: { sessionId: req.params.sessionId }, include: { submissions: true } });
  res.json({ data: { homework } });
});

export const submitHomework = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const student = await ownStudent(req.user!.id);
  const homework = await getPrisma().homework.findUnique({ where: { id: req.params.id }, include: { tutor: { include: { user: true } } } });
  if (!homework || !homework.studentIds.includes(student.id)) throw forbidden();
  const fileUrl = req.file ? await uploadFile(req.file, "submissions") : undefined;
  const submission = await getPrisma().homeworkSubmission.upsert({
    where: { homeworkId_studentId: { homeworkId: homework.id, studentId: student.id } },
    create: { homeworkId: homework.id, studentId: student.id, textAnswer: req.body.textAnswer, fileUrl },
    update: { textAnswer: req.body.textAnswer, fileUrl, submittedAt: new Date(), isReviewed: false }
  });
  await createNotification({
    userId: homework.tutor.userId,
    type: "homework:submitted",
    title: "Homework submitted",
    body: `${req.user!.name} submitted ${homework.title}.`,
    data: { homeworkTitle: homework.title, submittedAt: submission.submittedAt, studentName: req.user!.name }
  });
  res.status(201).json({ data: { submission } });
});

export const getHomeworkSubmissions = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const homework = await getPrisma().homework.findUnique({ where: { id: req.params.id } });
  if (!homework || homework.tutorId !== tutor.id) throw forbidden();
  const submissions = await getPrisma().homeworkSubmission.findMany({
    where: { homeworkId: homework.id },
    include: { student: { include: { user: true } } }
  });
  res.json({ data: { submissions } });
});

export const reviewSubmission = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const submission = await getPrisma().homeworkSubmission.findUnique({
    where: { id: req.params.id },
    include: { homework: true, student: { include: { user: true } } }
  });
  if (!submission || submission.homework.tutorId !== tutor.id) throw forbidden();
  const updated = await getPrisma().homeworkSubmission.update({
    where: { id: submission.id },
    data: {
      feedback: req.body.feedback,
      score: Number(req.body.score),
      topicTags: req.body.topicTags || [],
      isReviewed: true,
      reviewedAt: new Date()
    }
  });
  if (updated.score !== null) {
    await updatePassportAfterHomeworkReview({ studentId: submission.studentId, score: updated.score, topicTags: updated.topicTags });
  }
  res.json({ data: { submission: updated } });
});

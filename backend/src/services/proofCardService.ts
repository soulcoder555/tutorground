import type { ActivityLevel } from "@prisma/client";
import { getPrisma } from "../prisma";
import { forbidden, notFound } from "../utils/apiError";
import { emitToSession } from "../socket";
import { createNotifications } from "./notificationService";
import { updatePassportAfterSession } from "./learningPassportService";

export type ProofCardInput = {
  topicsCovered: string;
  doubtsSolved?: string;
  homeworkAssigned: boolean;
  homeworkDetails?: string;
  studentActivityLevel: ActivityLevel;
  tutorNotes?: string;
};

export async function generateProofCard(sessionId: string, tutorId: string, input: ProofCardInput) {
  const prisma = getPrisma();
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { tutor: { include: { user: true } } }
  });
  if (!session) throw notFound("Session not found");
  if (session.tutorId !== tutorId) throw forbidden();

  const students = await prisma.studentProfile.findMany({
    where: { id: { in: session.studentIds } },
    include: { user: true, parent: { include: { user: true } } }
  });
  const parentProfiles = students.map((student) => student.parent).filter(Boolean);
  const parentIds = parentProfiles.map((parent) => parent!.id);
  const parentUserIds = parentProfiles.map((parent) => parent!.userId);

  const endTime = session.actualEndTime || new Date();
  const startTime = session.actualStartTime || new Date(endTime.getTime() - session.durationMins * 60 * 1000);
  const durationMins = Math.max(1, Math.round((endTime.getTime() - startTime.getTime()) / 60000));

  const card = await prisma.teachingProofCard.upsert({
    where: { sessionId },
    create: {
      sessionId,
      tutorId,
      parentIds,
      topicsCovered: input.topicsCovered,
      doubtsSolved: input.doubtsSolved,
      homeworkAssigned: input.homeworkAssigned,
      homeworkDetails: input.homeworkDetails,
      studentActivityLevel: input.studentActivityLevel,
      durationMins,
      startTime,
      endTime,
      tutorNotes: input.tutorNotes,
      isDelivered: true
    },
    update: {
      parentIds,
      topicsCovered: input.topicsCovered,
      doubtsSolved: input.doubtsSolved,
      homeworkAssigned: input.homeworkAssigned,
      homeworkDetails: input.homeworkDetails,
      studentActivityLevel: input.studentActivityLevel,
      durationMins,
      startTime,
      endTime,
      tutorNotes: input.tutorNotes,
      isDelivered: true
    }
  });

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      proofCardGenerated: true,
      topicsCovered: input.topicsCovered,
      homeworkAssigned: input.homeworkAssigned
    }
  });

  await updatePassportAfterSession(session);
  await createNotifications(
    parentUserIds.map((userId) => ({
      userId,
      type: "proof-card:ready",
      title: "Teaching Proof Card ready",
      body: `${session.tutor.user.name} shared today's verified class summary.`,
      data: { sessionId, proofCardId: card.id, tutorName: session.tutor.user.name }
    }))
  );
  emitToSession(sessionId, "proof-card:ready", { sessionId, proofCardId: card.id, tutorName: session.tutor.user.name });
  return card;
}


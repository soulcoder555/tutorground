import type { Session } from "@prisma/client";
import { getPrisma } from "../prisma";

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function achievementsFor(totalSessions: number, subjects: string[]) {
  const achievements: string[] = [];
  if (totalSessions >= 100) achievements.push("100 Classes Attended");
  if (totalSessions >= 30) achievements.push("Consistent Learner");
  for (const subject of subjects) {
    if (totalSessions >= 20) achievements.push(`Subject Explorer: ${subject}`);
  }
  return unique(achievements);
}

export async function updatePassportAfterSession(session: Session) {
  const prisma = getPrisma();
  const tutor = await prisma.tutorProfile.findUnique({ where: { id: session.tutorId }, include: { user: true } });
  await Promise.all(
    session.studentIds.map(async (studentId) => {
      const existing = await prisma.learningPassport.findUnique({ where: { studentId } });
      const subjectsStudied = unique([...(existing?.subjectsStudied || []), session.subject]);
      const teachersHistory = unique([...(existing?.teachersHistory || []), tutor?.user.name || session.tutorId]);
      const totalSessions = (existing?.totalSessions || 0) + 1;
      await prisma.learningPassport.upsert({
        where: { studentId },
        create: {
          studentId,
          totalSessions,
          subjectsStudied,
          teachersHistory,
          strongTopics: [],
          weakTopics: [],
          achievements: achievementsFor(totalSessions, subjectsStudied)
        },
        update: {
          totalSessions,
          subjectsStudied,
          teachersHistory,
          achievements: achievementsFor(totalSessions, subjectsStudied)
        }
      });
    })
  );
}

export async function updatePassportAfterHomeworkReview(input: { studentId: string; score: number; topicTags: string[] }) {
  const passport = await getPrisma().learningPassport.upsert({
    where: { studentId: input.studentId },
    create: {
      studentId: input.studentId,
      strongTopics: input.score >= 80 ? input.topicTags : [],
      weakTopics: input.score < 50 ? input.topicTags : [],
      subjectsStudied: [],
      teachersHistory: [],
      achievements: [],
      totalSessions: 0
    },
    update: {
      strongTopics: input.score >= 80 ? { push: input.topicTags } : undefined,
      weakTopics: input.score < 50 ? { push: input.topicTags } : undefined
    }
  });

  await getPrisma().learningPassport.update({
    where: { id: passport.id },
    data: {
      strongTopics: unique(passport.strongTopics),
      weakTopics: unique(passport.weakTopics)
    }
  });
}


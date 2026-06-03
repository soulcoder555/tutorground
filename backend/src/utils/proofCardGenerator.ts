import type { ActivityLevel } from "@prisma/client";

export type ProofCardPdfPayload = {
  tutorName: string;
  studentNames: string[];
  subject: string;
  topicsCovered: string;
  doubtsSolved?: string | null;
  homeworkAssigned: boolean;
  homeworkDetails?: string | null;
  activityLevel: ActivityLevel;
  durationMins: number;
  startTime: Date;
  endTime: Date;
  tutorNotes?: string | null;
};

export function buildProofCardSummary(payload: ProofCardPdfPayload) {
  const studentLine = payload.studentNames.join(", ");
  const homeworkLine = payload.homeworkAssigned
    ? `Homework assigned: ${payload.homeworkDetails || "Details shared in class."}`
    : "No homework assigned.";

  return [
    `TutorGround Verified Session`,
    `Tutor: ${payload.tutorName}`,
    `Student: ${studentLine}`,
    `Subject: ${payload.subject}`,
    `Duration: ${payload.durationMins} minutes`,
    `Topics: ${payload.topicsCovered}`,
    payload.doubtsSolved ? `Doubts solved: ${payload.doubtsSolved}` : undefined,
    homeworkLine,
    `Activity level: ${payload.activityLevel}`,
    payload.tutorNotes ? `Tutor notes: ${payload.tutorNotes}` : undefined
  ]
    .filter(Boolean)
    .join("\n");
}


import type { Booking, Homework, NotificationItem, Passport, ProofCard, Session, Tutor } from "@/types";

export const sampleTutors: Tutor[] = [
  {
    id: "tutor-1",
    profileUrl: "verified-math-tutor",
    user: { name: "Verified Math Tutor", avatarUrl: null, createdAt: "2024-02-14" },
    bio: "Patient mathematics tutor focused on board exam clarity, daily practice, and parent-visible accountability.",
    subjects: ["Math", "Physics"],
    classesTeaching: ["9", "10", "11", "12", "JEE"],
    hourlyRate: 650,
    teachingMode: "BOTH",
    experienceYears: 8,
    qualifications: ["MSc Mathematics", "BEd"],
    verificationLevel: 3,
    ratingAvg: 4.9,
    totalReviews: 32,
    studentCount: 84,
    totalSessions: 620,
    city: "Jammu",
    state: "Jammu and Kashmir",
    latitude: 32.7266,
    longitude: 74.857,
    distanceKm: 2.4,
    smartMatchScore: 94,
    punctualityScore: 98,
    responseRate: 94,
    consistencyScore: 96,
    teachingStyle: "Concept-first teaching with weekly topic recaps."
  },
  {
    id: "tutor-2",
    profileUrl: "science-mentor-preview",
    user: { name: "Science Mentor Preview", avatarUrl: null, createdAt: "2023-09-12" },
    bio: "Science and NEET foundation teacher with structured homework reviews and quick doubt support.",
    subjects: ["Biology", "Chemistry"],
    classesTeaching: ["10", "11", "12", "NEET"],
    hourlyRate: 720,
    teachingMode: "ONLINE",
    experienceYears: 6,
    qualifications: ["MSc Zoology"],
    verificationLevel: 2,
    ratingAvg: 4.7,
    totalReviews: 21,
    studentCount: 56,
    totalSessions: 410,
    city: "Jammu",
    state: "Jammu and Kashmir",
    latitude: 32.7357,
    longitude: 74.8691,
    distanceKm: 4.1,
    smartMatchScore: 88,
    punctualityScore: 93,
    responseRate: 91,
    consistencyScore: 90,
    teachingStyle: "Exam-oriented lessons with visual notes."
  },
  {
    id: "tutor-3",
    profileUrl: "language-coach-preview",
    user: { name: "Language Coach Preview", avatarUrl: null, createdAt: "2022-11-03" },
    bio: "Language coach for school English, Hindi, spoken confidence, and writing improvement.",
    subjects: ["English", "Hindi"],
    classesTeaching: ["6", "7", "8", "9", "10"],
    hourlyRate: 450,
    teachingMode: "OFFLINE",
    experienceYears: 11,
    qualifications: ["MA English", "BEd"],
    verificationLevel: 3,
    ratingAvg: 4.8,
    totalReviews: 46,
    studentCount: 120,
    totalSessions: 980,
    city: "Jammu",
    state: "Jammu and Kashmir",
    latitude: 32.718,
    longitude: 74.844,
    distanceKm: 1.8,
    smartMatchScore: 90,
    punctualityScore: 97,
    responseRate: 96,
    consistencyScore: 95,
    teachingStyle: "Reading, writing, and weekly parent updates."
  }
];

export const sampleSessions: Session[] = [
  { id: "session-1", tutorId: "tutor-1", studentIds: ["student-1"], subject: "Math", classLevel: "10", scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMins: 60, mode: "BOTH", status: "SCHEDULED" },
  { id: "session-2", tutorId: "tutor-1", studentIds: ["student-1"], subject: "Physics", classLevel: "10", scheduledAt: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), durationMins: 75, mode: "ONLINE", status: "LIVE", meetingLink: "https://meet.jit.si/tutorground-session-2" },
  { id: "session-3", tutorId: "tutor-1", studentIds: ["student-2"], subject: "Math", classLevel: "12", scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), durationMins: 90, mode: "OFFLINE", status: "COMPLETED" }
];

export const sampleHomework: Homework[] = [
  { id: "hw-1", sessionId: "session-1", title: "Quadratic equations worksheet", description: "Solve problems 1-20 and mark doubts.", dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), submissions: [] },
  { id: "hw-2", sessionId: "session-3", title: "Physics numericals", description: "Motion chapter numerical set.", dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), submissions: [{ id: "sub-1", homeworkId: "hw-2", studentId: "student-1", textAnswer: "Uploaded notebook scans.", isReviewed: true, submittedAt: new Date().toISOString(), score: 86, feedback: "Good setup. Revise units." }] }
];

export const sampleProofCards: ProofCard[] = [
  {
    id: "proof-1",
    sessionId: "session-3",
    topicsCovered: "Linear equations, substitution method, graph interpretation",
    doubtsSolved: "Sign errors in elimination method",
    homeworkAssigned: true,
    homeworkDetails: "Worksheet Q1-Q12",
    studentActivityLevel: "HIGH",
    durationMins: 62,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 62 * 60 * 1000).toISOString(),
    tutorNotes: "Student is improving speed; needs one more practice set.",
    generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tutor: sampleTutors[0]
  }
];

export const samplePassport: Passport = {
  strongTopics: ["Algebra", "Kinematics", "Essay structure"],
  weakTopics: ["Trigonometry identities", "Unit conversion"],
  totalSessions: 42,
  subjectsStudied: ["Math", "Physics", "English"],
  achievements: ["Perfect Week", "Consistent Learner"],
  teachersHistory: ["Verified Math Tutor", "Science Mentor Preview"]
};

export const sampleBookings: Booking[] = [
  { id: "booking-1", tutorId: "tutor-1", parentId: "parent-1", studentId: "student-1", subject: "Math", classLevel: "10", mode: "OFFLINE", preferredTime: "Mon/Wed 6 PM", status: "PENDING", createdAt: new Date().toISOString(), message: "Need board exam support." }
];

export const sampleNotifications: NotificationItem[] = [
  { id: "note-1", type: "session:started", title: "Class started", body: "Verified Math Tutor started Math class.", isRead: false, createdAt: new Date().toISOString() },
  { id: "note-2", type: "proof-card:ready", title: "Proof card ready", body: "Today's verified class summary is available.", isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() }
];

export const attendanceTrend = [
  { day: "Mon", present: 1, late: 0, absent: 0 },
  { day: "Tue", present: 1, late: 0, absent: 0 },
  { day: "Wed", present: 0, late: 1, absent: 0 },
  { day: "Thu", present: 1, late: 0, absent: 0 },
  { day: "Fri", present: 0, late: 0, absent: 1 },
  { day: "Sat", present: 1, late: 0, absent: 0 }
];

export const scoreTrend = [
  { week: "W1", score: 64 },
  { week: "W2", score: 70 },
  { week: "W3", score: 78 },
  { week: "W4", score: 86 }
];

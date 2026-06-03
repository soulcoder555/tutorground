export type Role = "TUTOR" | "STUDENT" | "PARENT" | "ADMIN";
export type TeachingMode = "ONLINE" | "OFFLINE" | "BOTH";
export type SessionStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED" | "MISSED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export type ActivityLevel = "LOW" | "MEDIUM" | "HIGH" | "EXCELLENT";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string | null;
  isVerified?: boolean;
};

export type Tutor = {
  id: string;
  profileUrl: string;
  user?: Pick<User, "name" | "avatarUrl"> & { createdAt?: string };
  bio: string;
  subjects: string[];
  classesTeaching: string[];
  hourlyRate: number;
  teachingMode: TeachingMode;
  experienceYears: number;
  qualifications: string[];
  verificationLevel: number;
  ratingAvg: number;
  totalReviews: number;
  studentCount: number;
  totalSessions: number;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  distanceKm?: number | null;
  smartMatchScore?: number;
  punctualityScore: number;
  responseRate: number;
  consistencyScore: number;
  teachingStyle?: string | null;
};

export type Session = {
  id: string;
  tutorId: string;
  studentIds: string[];
  subject: string;
  classLevel: string;
  scheduledAt: string;
  durationMins: number;
  mode: TeachingMode;
  status: SessionStatus;
  meetingLink?: string | null;
  jitsiRoomId?: string | null;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
};

export type Homework = {
  id: string;
  sessionId: string;
  title: string;
  description?: string | null;
  dueDate: string;
  fileUrl?: string | null;
  submissions?: HomeworkSubmission[];
};

export type HomeworkSubmission = {
  id: string;
  homeworkId: string;
  studentId: string;
  textAnswer?: string | null;
  fileUrl?: string | null;
  feedback?: string | null;
  score?: number | null;
  isReviewed: boolean;
  submittedAt: string;
};

export type ProofCard = {
  id: string;
  sessionId: string;
  topicsCovered: string;
  doubtsSolved?: string | null;
  homeworkAssigned: boolean;
  homeworkDetails?: string | null;
  studentActivityLevel: ActivityLevel;
  durationMins: number;
  startTime: string;
  endTime: string;
  tutorNotes?: string | null;
  generatedAt: string;
  tutor?: Tutor;
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
};

export type Booking = {
  id: string;
  tutorId: string;
  parentId: string;
  studentId: string;
  subject: string;
  classLevel: string;
  mode: TeachingMode;
  preferredTime: string;
  message?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  createdAt: string;
};

export type Passport = {
  strongTopics: string[];
  weakTopics: string[];
  totalSessions: number;
  subjectsStudied: string[];
  achievements: string[];
  teachersHistory: string[];
};


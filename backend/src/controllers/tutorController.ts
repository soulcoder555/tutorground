import type { AuthenticatedRequest } from "../types";
import { getPrisma } from "../prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { badRequest, notFound } from "../utils/apiError";
import { uploadFile } from "../services/uploadService";

async function ownTutorProfile(userId: string) {
  const profile = await getPrisma().tutorProfile.findUnique({ where: { userId } });
  if (!profile) throw notFound("Tutor profile not found");
  return profile;
}

export const getTutorProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const profile = await getPrisma().tutorProfile.findUnique({
    where: { userId: req.user!.id },
    include: { user: true, verification: true, availability: true }
  });
  res.json({ data: { profile } });
});

export const updateTutorProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const body = req.body;
  const profile = await getPrisma().tutorProfile.upsert({
    where: { userId: req.user!.id },
    create: {
      userId: req.user!.id,
      bio: body.bio,
      subjects: body.subjects,
      classesTeaching: body.classesTeaching,
      hourlyRate: Number(body.hourlyRate),
      teachingMode: body.teachingMode,
      experienceYears: Number(body.experienceYears),
      qualifications: body.qualifications || [],
      profileUrl: body.profileUrl,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      address: body.address,
      city: body.city,
      state: body.state,
      gender: body.gender,
      teachingStyle: body.teachingStyle
    },
    update: {
      bio: body.bio,
      subjects: body.subjects,
      classesTeaching: body.classesTeaching,
      hourlyRate: Number(body.hourlyRate),
      teachingMode: body.teachingMode,
      experienceYears: Number(body.experienceYears),
      qualifications: body.qualifications || [],
      profileUrl: body.profileUrl,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      address: body.address,
      city: body.city,
      state: body.state,
      gender: body.gender,
      teachingStyle: body.teachingStyle
    }
  });
  res.json({ data: { profile } });
});

export const getPublicTutorProfile = asyncHandler(async (req, res) => {
  const profile = await getPrisma().tutorProfile.findUnique({
    where: { profileUrl: req.params.profileUrl },
    include: {
      user: { select: { name: true, avatarUrl: true, createdAt: true } },
      verification: true,
      availability: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { parent: { include: { user: { select: { name: true } } } }, student: true }
      }
    }
  });
  if (!profile) throw notFound("Tutor not found");

  const similarTutors = await getPrisma().tutorProfile.findMany({
    where: {
      id: { not: profile.id },
      city: profile.city,
      subjects: { hasSome: profile.subjects },
      isAvailable: true
    },
    include: { user: { select: { name: true, avatarUrl: true } } },
    take: 3
  });
  res.json({ data: { profile, similarTutors } });
});

export const setAvailability = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutorProfile(req.user!.id);
  const slots = Array.isArray(req.body.slots) ? req.body.slots : [];
  await getPrisma().$transaction([
    getPrisma().availabilitySlot.deleteMany({ where: { tutorId: tutor.id } }),
    getPrisma().availabilitySlot.createMany({
      data: slots.map((slot: { dayOfWeek: number; startTime: string; endTime: string; mode?: string }) => ({
        tutorId: tutor.id,
        dayOfWeek: Number(slot.dayOfWeek),
        startTime: slot.startTime,
        endTime: slot.endTime,
        mode: slot.mode || "BOTH"
      }))
    })
  ]);
  const availability = await getPrisma().availabilitySlot.findMany({ where: { tutorId: tutor.id } });
  res.json({ data: { availability } });
});

export const getTutorStudents = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutorProfile(req.user!.id);
  const sessions = await getPrisma().session.findMany({ where: { tutorId: tutor.id }, select: { studentIds: true } });
  const studentIds = Array.from(new Set(sessions.flatMap((session) => session.studentIds)));
  const students = await getPrisma().studentProfile.findMany({
    where: { id: { in: studentIds } },
    include: { user: { select: { name: true, email: true, phone: true, avatarUrl: true } }, parent: { include: { user: true } } }
  });
  res.json({ data: { students } });
});

export const getTutorSessions = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutorProfile(req.user!.id);
  const sessions = await getPrisma().session.findMany({
    where: { tutorId: tutor.id },
    orderBy: { scheduledAt: "desc" },
    include: { attendance: true, homework: true, proofCard: true }
  });
  res.json({ data: { sessions } });
});

export const getTutorEarnings = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutorProfile(req.user!.id);
  const earnings = await getPrisma().earning.findMany({ where: { tutorId: tutor.id }, orderBy: { createdAt: "desc" } });
  const total = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonth = earnings.filter((earning) => earning.createdAt >= monthStart).reduce((sum, earning) => sum + earning.netAmount, 0);
  res.json({ data: { total, thisMonth, earnings } });
});

export const uploadTutorDocuments = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutorProfile(req.user!.id);
  const files = req.files as Record<string, Express.Multer.File[]>;
  if (!files) throw badRequest("No documents uploaded");
  const idProofUrl = files.idProof?.[0] ? await uploadFile(files.idProof[0], "tutor-documents") : undefined;
  const degreeUrl = files.degree?.[0] ? await uploadFile(files.degree[0], "tutor-documents") : undefined;
  const photoUrl = files.photo?.[0] ? await uploadFile(files.photo[0], "tutor-documents") : undefined;

  const verification = await getPrisma().tutorVerification.upsert({
    where: { tutorId: tutor.id },
    create: { tutorId: tutor.id, idProofUrl, degreeUrl, photoUrl },
    update: { idProofUrl, degreeUrl, photoUrl, status: "PENDING", adminNotes: null }
  });
  res.status(201).json({ data: { verification } });
});


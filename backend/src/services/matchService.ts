import type { AvailabilitySlot, TeachingMode, TutorProfile } from "@prisma/client";
import { getPrisma } from "../prisma";
import { cacheGet, cacheSet } from "./cacheService";
import { haversineDistanceKm } from "../utils/distance";

export type TutorSearchParams = {
  subject?: string;
  classLevel?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  mode?: TeachingMode;
  maxRate?: number;
  minRating?: number;
  gender?: string;
  verificationLevel?: number;
  availability?: string;
  sortBy?: "distance" | "rating" | "price" | "smart_score";
};

export type MatchedTutor = TutorProfile & {
  distanceKm: number | null;
  subjectMatchScore: number;
  smartMatchScore: number;
  user: { name: string; avatarUrl: string | null; createdAt: Date };
  availability?: AvailabilitySlot[];
};

export function subjectMatchScore(subjects: string[], query?: string) {
  if (!query) return 100;
  const normalized = query.toLowerCase();
  if (subjects.some((subject) => subject.toLowerCase() === normalized)) return 100;
  if (subjects.some((subject) => subject.toLowerCase().includes(normalized) || normalized.includes(subject.toLowerCase()))) return 50;
  return 0;
}

export function calculateSmartMatchScore(input: {
  distanceKm: number;
  maxRadius: number;
  ratingAvg: number;
  consistencyScore: number;
  subjectMatchScore: number;
  responseRate: number;
}) {
  const distanceComponent = Math.max(0, 1 - input.distanceKm / input.maxRadius) * 30;
  const ratingComponent = (input.ratingAvg / 5) * 25;
  const consistencyComponent = (input.consistencyScore / 100) * 20;
  const subjectComponent = (input.subjectMatchScore / 100) * 15;
  const responseComponent = (input.responseRate / 100) * 10;
  return Number((distanceComponent + ratingComponent + consistencyComponent + subjectComponent + responseComponent).toFixed(2));
}

export async function searchTutors(params: TutorSearchParams): Promise<MatchedTutor[]> {
  const radius = params.radius || 10;
  const cacheKey = `search:tutors:${JSON.stringify(params)}`;
  const cached = await cacheGet<MatchedTutor[]>(cacheKey);
  if (cached) return cached;

  const modeValues: TeachingMode[] | undefined = params.mode
    ? params.mode === "BOTH"
      ? ["ONLINE", "OFFLINE", "BOTH"]
      : [params.mode, "BOTH"]
    : undefined;
  const tutors = await getPrisma().tutorProfile.findMany({
    where: {
      isAvailable: true,
      hourlyRate: params.maxRate ? { lte: params.maxRate } : undefined,
      ratingAvg: params.minRating ? { gte: params.minRating } : undefined,
      gender: params.gender,
      verificationLevel: params.verificationLevel ? { gte: params.verificationLevel } : undefined,
      teachingMode: modeValues ? { in: modeValues } : undefined,
      classesTeaching: params.classLevel ? { has: params.classLevel } : undefined
    },
    include: {
      user: { select: { name: true, avatarUrl: true, createdAt: true } },
      availability: true
    },
    take: 100
  });

  const results = tutors
    .map((tutor) => {
      const distanceKm =
        params.lat !== undefined && params.lng !== undefined
          ? haversineDistanceKm(params.lat, params.lng, tutor.latitude, tutor.longitude)
          : null;
      const subScore = subjectMatchScore(tutor.subjects, params.subject);
      const smartMatchScore = calculateSmartMatchScore({
        distanceKm: distanceKm || 0,
        maxRadius: radius,
        ratingAvg: tutor.ratingAvg,
        consistencyScore: tutor.consistencyScore,
        subjectMatchScore: subScore,
        responseRate: tutor.responseRate
      });
      return { ...tutor, distanceKm, subjectMatchScore: subScore, smartMatchScore };
    })
    .filter((tutor) => tutor.subjectMatchScore > 0)
    .filter((tutor) => tutor.distanceKm === null || tutor.distanceKm <= radius)
    .filter((tutor) => !params.availability || tutor.availability?.some((slot) => slot.dayOfWeek === Number(params.availability)));

  results.sort((a, b) => {
    if (params.sortBy === "distance") return (a.distanceKm || 0) - (b.distanceKm || 0);
    if (params.sortBy === "rating") return b.ratingAvg - a.ratingAvg;
    if (params.sortBy === "price") return a.hourlyRate - b.hourlyRate;
    return b.smartMatchScore - a.smartMatchScore;
  });

  await cacheSet(cacheKey, results, 5 * 60);
  return results;
}

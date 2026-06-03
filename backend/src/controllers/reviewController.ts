import type { AuthenticatedRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { getPrisma } from "../prisma";
import { forbidden, notFound, badRequest } from "../utils/apiError";

async function recalculateTutorRating(tutorId: string) {
  const aggregate = await getPrisma().review.aggregate({
    where: { tutorId },
    _avg: { rating: true },
    _count: { id: true }
  });
  await getPrisma().tutorProfile.update({
    where: { id: tutorId },
    data: {
      ratingAvg: Number((aggregate._avg.rating || 0).toFixed(2)),
      totalReviews: aggregate._count.id
    }
  });
}

export const createReview = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const parent = await getPrisma().parentProfile.findUnique({ where: { userId: req.user!.id } });
  if (!parent) throw notFound("Parent profile not found");
  if (!parent.studentIds.includes(req.body.studentId)) throw forbidden("Student is not linked to this parent");

  const completedSessions = await getPrisma().session.count({
    where: {
      tutorId: req.body.tutorId,
      studentIds: { has: req.body.studentId },
      status: "COMPLETED"
    }
  });
  if (completedSessions < 3) throw badRequest("Reviews are allowed after at least 3 completed sessions", "REVIEW_NOT_ELIGIBLE");

  const review = await getPrisma().review.create({
    data: {
      tutorId: req.body.tutorId,
      parentId: parent.id,
      studentId: req.body.studentId,
      rating: Number(req.body.rating),
      writtenReview: req.body.writtenReview,
      sessionCountAtTime: completedSessions
    },
    include: { parent: { include: { user: true } }, student: true }
  });
  await recalculateTutorRating(req.body.tutorId);
  res.status(201).json({ data: { review } });
});

export const getTutorReviews = asyncHandler(async (req, res) => {
  const reviews = await getPrisma().review.findMany({
    where: { tutorId: req.params.tutorId },
    include: { parent: { include: { user: { select: { name: true } } } }, student: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ data: { reviews } });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await getPrisma().review.delete({ where: { id: req.params.id } });
  await recalculateTutorRating(review.tutorId);
  res.json({ data: { deleted: true } });
});


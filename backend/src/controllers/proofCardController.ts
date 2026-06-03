import type { AuthenticatedRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { getPrisma } from "../prisma";
import { forbidden, notFound } from "../utils/apiError";
import { generateProofCard } from "../services/proofCardService";

export const generateProofCardController = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await getPrisma().tutorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!tutor) throw notFound("Tutor profile not found");
  const card = await generateProofCard(req.params.sessionId, tutor.id, req.body);
  res.status(201).json({ data: { proofCard: card } });
});

export const getProofCardBySession = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const card = await getPrisma().teachingProofCard.findUnique({
    where: { sessionId: req.params.sessionId },
    include: { session: true, tutor: { include: { user: true } } }
  });
  if (!card) throw notFound("Proof card not found");
  if (req.user!.role === "PARENT") {
    const parent = await getPrisma().parentProfile.findUnique({ where: { userId: req.user!.id } });
    if (!parent || !card.parentIds.includes(parent.id)) throw forbidden();
  }
  res.json({ data: { proofCard: card } });
});

export const getProofCardsForParent = asyncHandler(async (req: AuthenticatedRequest, res) => {
  if (req.user!.role === "PARENT") {
    const parent = await getPrisma().parentProfile.findUnique({ where: { userId: req.user!.id } });
    if (!parent || parent.id !== req.params.parentId) throw forbidden();
  }
  const proofCards = await getPrisma().teachingProofCard.findMany({
    where: { parentIds: { has: req.params.parentId } },
    include: { session: true, tutor: { include: { user: true } } },
    orderBy: { generatedAt: "desc" }
  });
  res.json({ data: { proofCards } });
});


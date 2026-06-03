import type { AuthenticatedRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { getPrisma } from "../prisma";
import { forbidden, notFound } from "../utils/apiError";
import { createNotification } from "../services/notificationService";

async function ownTutor(userId: string) {
  const tutor = await getPrisma().tutorProfile.findUnique({ where: { userId } });
  if (!tutor) throw notFound("Tutor profile not found");
  return tutor;
}

async function notifyBookingResponse(bookingId: string, type: "booking:accepted" | "booking:rejected") {
  const booking = await getPrisma().booking.findUnique({
    where: { id: bookingId },
    include: { tutor: { include: { user: true } }, parent: { include: { user: true } } }
  });
  if (!booking) return;
  await createNotification({
    userId: booking.parent.userId,
    type,
    title: type === "booking:accepted" ? "Booking accepted" : "Booking rejected",
    body: `${booking.tutor.user.name} ${type === "booking:accepted" ? "accepted" : "rejected"} your ${booking.subject} request.`,
    data: { bookingId: booking.id, tutorName: booking.tutor.user.name, subject: booking.subject }
  });
}

export const tutorBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const bookings = await getPrisma().booking.findMany({
    where: { tutorId: tutor.id },
    include: { parent: { include: { user: true } }, student: { include: { user: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ data: { bookings } });
});

export const acceptBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const booking = await getPrisma().booking.findUnique({ where: { id: req.params.id } });
  if (!booking || booking.tutorId !== tutor.id) throw forbidden();
  const updated = await getPrisma().booking.update({ where: { id: booking.id }, data: { status: "ACCEPTED", respondedAt: new Date() } });
  await notifyBookingResponse(updated.id, "booking:accepted");
  res.json({ data: { booking: updated } });
});

export const rejectBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const tutor = await ownTutor(req.user!.id);
  const booking = await getPrisma().booking.findUnique({ where: { id: req.params.id } });
  if (!booking || booking.tutorId !== tutor.id) throw forbidden();
  const updated = await getPrisma().booking.update({ where: { id: booking.id }, data: { status: "REJECTED", respondedAt: new Date() } });
  await notifyBookingResponse(updated.id, "booking:rejected");
  res.json({ data: { booking: updated } });
});

export const deleteBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const booking = await getPrisma().booking.findUnique({ where: { id: req.params.id }, include: { tutor: true, parent: true } });
  if (!booking) throw notFound("Booking not found");
  if (req.user!.role === "TUTOR" && booking.tutor.userId !== req.user!.id) throw forbidden();
  if (req.user!.role === "PARENT" && booking.parent.userId !== req.user!.id) throw forbidden();
  await getPrisma().booking.delete({ where: { id: booking.id } });
  res.json({ data: { deleted: true } });
});


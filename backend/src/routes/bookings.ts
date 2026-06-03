import { Router } from "express";
import { acceptBooking, deleteBooking, rejectBooking, tutorBookings } from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

export const bookingsRouter = Router();

bookingsRouter.get("/", requireAuth, requireRole("TUTOR"), tutorBookings);
bookingsRouter.patch("/:id/accept", requireAuth, requireRole("TUTOR"), acceptBooking);
bookingsRouter.patch("/:id/reject", requireAuth, requireRole("TUTOR"), rejectBooking);
bookingsRouter.delete("/:id", requireAuth, deleteBooking);


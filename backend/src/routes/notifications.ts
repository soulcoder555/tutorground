import { Router } from "express";
import { deleteNotification, listNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notificationController";
import { requireAuth } from "../middleware/auth";

export const notificationsRouter = Router();

notificationsRouter.get("/", requireAuth, listNotifications);
notificationsRouter.patch("/read-all", requireAuth, markAllNotificationsRead);
notificationsRouter.patch("/:id/read", requireAuth, markNotificationRead);
notificationsRouter.delete("/:id", requireAuth, deleteNotification);


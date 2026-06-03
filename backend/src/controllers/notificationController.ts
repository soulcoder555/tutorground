import type { AuthenticatedRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { getPrisma } from "../prisma";
import { forbidden, notFound } from "../utils/apiError";

export const listNotifications = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = Number(req.query.page || 1);
  const pageSize = Math.min(Number(req.query.pageSize || 20), 100);
  const [items, total] = await Promise.all([
    getPrisma().notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    getPrisma().notification.count({ where: { userId: req.user!.id } })
  ]);
  res.json({ data: { items, page, pageSize, total } });
});

export const markNotificationRead = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const notification = await getPrisma().notification.findUnique({ where: { id: req.params.id } });
  if (!notification) throw notFound("Notification not found");
  if (notification.userId !== req.user!.id) throw forbidden();
  const updated = await getPrisma().notification.update({ where: { id: notification.id }, data: { isRead: true } });
  res.json({ data: { notification: updated } });
});

export const markAllNotificationsRead = asyncHandler(async (req: AuthenticatedRequest, res) => {
  await getPrisma().notification.updateMany({ where: { userId: req.user!.id, isRead: false }, data: { isRead: true } });
  res.json({ data: { updated: true } });
});

export const deleteNotification = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const notification = await getPrisma().notification.findUnique({ where: { id: req.params.id } });
  if (!notification) throw notFound("Notification not found");
  if (notification.userId !== req.user!.id) throw forbidden();
  await getPrisma().notification.delete({ where: { id: notification.id } });
  res.json({ data: { deleted: true } });
});


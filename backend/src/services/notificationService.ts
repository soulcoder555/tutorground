import { Prisma, type NotificationChannel } from "@prisma/client";
import { getPrisma } from "../prisma";
import { emitToUser } from "../socket";

type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channel?: NotificationChannel;
};

export async function createNotification(input: NotificationInput) {
  const notification = await getPrisma().notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      data: (input.data || {}) as Prisma.InputJsonValue,
      channel: input.channel || "IN_APP"
    }
  });
  emitToUser(input.userId, "notification:new", notification);
  return notification;
}

export async function createNotifications(inputs: NotificationInput[]) {
  return Promise.all(inputs.map(createNotification));
}

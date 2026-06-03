"use client";

import { create } from "zustand";
import { getSocket } from "@/lib/socket";
import type { NotificationItem } from "@/types";

type NotificationState = {
  notifications: NotificationItem[];
  connected: boolean;
  setNotifications: (notifications: NotificationItem[]) => void;
  connect: () => void;
  markRead: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  connected: false,
  setNotifications: (notifications) => set({ notifications }),
  connect: () => {
    const socket = getSocket();
    socket.off("notification:new");
    socket.on("notification:new", (notification: NotificationItem) => {
      set({ notifications: [notification, ...get().notifications] });
    });
    socket.connect();
    set({ connected: true });
  },
  markRead: (id) => {
    set({ notifications: get().notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item)) });
  }
}));

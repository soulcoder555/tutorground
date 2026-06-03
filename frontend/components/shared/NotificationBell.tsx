"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);
  const connect = useNotificationStore((state) => state.connect);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const markRead = useNotificationStore((state) => state.markRead);
  const unread = notifications.filter((item) => !item.isRead).length;

  React.useEffect(() => {
    if (!user) return;
    connect();
    api
      .get("/notifications")
      .then((response) => setNotifications(response.data.data.items))
      .catch(() => undefined);
  }, [connect, setNotifications, user]);

  async function handleRead(id: string) {
    markRead(id);
    await api.patch(`/notifications/${id}/read`).catch(() => undefined);
  }

  return (
    <div className="relative">
      <Button variant="outline" size="icon" aria-label="Notifications" onClick={() => setOpen((value) => !value)}>
        <Bell className="h-4 w-4" />
        {unread ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{unread}</span> : null}
      </Button>
      {open ? (
        <Card className="absolute right-0 mt-2 w-80 overflow-hidden p-0">
          <div className="border-b p-3 text-sm font-semibold">Notifications</div>
          <div className="max-h-80 overflow-y-auto tg-scrollbar">
            {notifications.length ? (
              notifications.map((item) => (
                <button key={item.id} type="button" onClick={() => handleRead(item.id)} className="block w-full border-b p-3 text-left last:border-0 hover:bg-slate-50">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground">No notifications yet.</p>
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

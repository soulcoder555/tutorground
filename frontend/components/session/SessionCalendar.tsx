"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Session } from "@/types";

export function SessionCalendar({ sessions }: { sessions: Session[] }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height="auto"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
        events={sessions.map((session) => ({
          id: session.id,
          title: `${session.subject} - ${session.classLevel}`,
          start: session.scheduledAt,
          end: new Date(new Date(session.scheduledAt).getTime() + session.durationMins * 60000).toISOString()
        }))}
      />
    </div>
  );
}


"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { SessionCard } from "@/components/session/SessionCard";
import { CreateSessionModal } from "@/components/session/CreateSessionModal";
import { SessionCalendar } from "@/components/session/SessionCalendar";
import { api, getApiErrorMessage } from "@/lib/api";
import { sampleSessions } from "@/lib/sample-data";
import type { Session } from "@/types";

export default function SessionsPage() {
  const [open, setOpen] = React.useState(false);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function loadSessions() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/tutors/sessions");
      setSessions(response.data.data.sessions);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not load sessions."));
      setSessions(sampleSessions);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadSessions();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold">Session Scheduling</h1>
            <p className="mt-1 text-muted-foreground">Create one-time or recurring sessions and open Jitsi rooms when class starts.</p>
          </div>
          <Button onClick={() => setOpen(true)}>Create Session</Button>
        </div>
        {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading sessions...</p> : null}
        <SessionCalendar sessions={sessions} />
        <div className="grid gap-4 lg:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
        <CreateSessionModal open={open} onOpenChange={setOpen} onCreated={loadSessions} />
      </div>
    </AppShell>
  );
}

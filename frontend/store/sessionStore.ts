"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { Session } from "@/types";

type SessionState = {
  sessions: Session[];
  activeSession: Session | null;
  setSessions: (sessions: Session[]) => void;
  startSession: (sessionId: string) => Promise<Session>;
  endSession: (sessionId: string, payload: Record<string, unknown>) => Promise<void>;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  activeSession: null,
  setSessions: (sessions) => set({ sessions }),
  startSession: async (sessionId) => {
    const response = await api.post(`/sessions/${sessionId}/start`);
    const session = response.data.data.session as Session;
    set({ activeSession: session, sessions: get().sessions.map((item) => (item.id === session.id ? session : item)) });
    return session;
  },
  endSession: async (sessionId, payload) => {
    const response = await api.post(`/sessions/${sessionId}/end`, payload);
    const session = response.data.data.session as Session;
    set({ activeSession: null, sessions: get().sessions.map((item) => (item.id === session.id ? session : item)) });
  }
}));


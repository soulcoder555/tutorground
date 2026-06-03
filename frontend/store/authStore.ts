"use client";

import { create } from "zustand";
import { api, getApiErrorMessage } from "@/lib/api";
import { clearSession, readSession, saveSession } from "@/lib/auth";
import type { Role, User } from "@/types";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: { name: string; email: string; password: string; role: Role }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,
  error: null,
  hydrate: async () => {
    const session = readSession();
    set({ user: session.user, token: null });
    try {
      const response = await api.get("/auth/me");
      const user = response.data.data.user as User | null;
      if (user) saveSession({ user });
      set({ user, initialized: true });
    } catch {
      clearSession();
      set({ user: null, token: null, initialized: true });
    }
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data.data;
      saveSession({ user: data.user });
      set({ user: data.user, token: null, loading: false, initialized: true });
    } catch (error) {
      const message = getApiErrorMessage(error, "Login failed");
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },
  signup: async (input) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/signup", input);
      set({ loading: false });
    } catch (error) {
      const message = getApiErrorMessage(error, "Signup failed");
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },
  logout: async () => {
    await api.post("/auth/logout").catch(() => undefined);
    clearSession();
    set({ user: null, token: null, error: null, initialized: true });
  }
}));

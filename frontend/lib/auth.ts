import type { Role, User } from "@/types";

export type AuthSession = {
  user: User;
};

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("tg_access_token");
  window.localStorage.setItem("tg_user", JSON.stringify(session.user));
}

export function readSession(): { user: User | null } {
  if (typeof window === "undefined") return { user: null };
  const rawUser = window.localStorage.getItem("tg_user");
  return { user: rawUser ? (JSON.parse(rawUser) as User) : null };
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("tg_access_token");
  window.localStorage.removeItem("tg_user");
}

export function defaultRouteForRole(role: Role) {
  if (role === "TUTOR") return "/dashboard";
  if (role === "PARENT") return "/parent-dashboard";
  if (role === "STUDENT") return "/student-dashboard";
  return "/admin/dashboard";
}

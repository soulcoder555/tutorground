"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { defaultRouteForRole } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types";
import { Sidebar } from "./Sidebar";

type ShellRole = "tutor" | "parent" | "student" | "admin";

const shellThemes: Record<ShellRole, string> = {
  tutor: "bg-[radial-gradient(circle_at_10%_0%,rgba(245,158,11,0.24),transparent_28rem),radial-gradient(circle_at_88%_8%,rgba(79,70,229,0.16),transparent_30rem),linear-gradient(135deg,#fff7ed_0%,#fff1f2_46%,#e0e7ff_100%)]",
  parent: "bg-[radial-gradient(circle_at_8%_0%,rgba(244,114,182,0.22),transparent_28rem),radial-gradient(circle_at_92%_8%,rgba(245,158,11,0.18),transparent_30rem),linear-gradient(135deg,#fff1f2_0%,#fffbeb_44%,#dbeafe_100%)]",
  student: "bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.22),transparent_28rem),radial-gradient(circle_at_88%_10%,rgba(129,140,248,0.18),transparent_30rem),linear-gradient(135deg,#08111f_0%,#17143f_48%,#0f766e_120%)]",
  admin: "bg-[radial-gradient(circle_at_10%_0%,rgba(45,212,191,0.2),transparent_28rem),radial-gradient(circle_at_88%_8%,rgba(79,70,229,0.14),transparent_30rem),linear-gradient(135deg,#f0fdfa_0%,#fff7ed_45%,#e0f2fe_100%)]"
};

const panelThemes: Record<ShellRole, string> = {
  tutor: "bg-[#fff7ed]/60",
  parent: "bg-[#fff1f2]/60",
  student: "bg-[#07111f]/20 text-white",
  admin: "bg-[#ecfeff]/60"
};

const roleNames: Record<Role, string> = {
  TUTOR: "Teacher",
  PARENT: "Parent",
  STUDENT: "Student",
  ADMIN: "Admin"
};

function getShellRole(pathname: string): ShellRole {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/parent-dashboard") || pathname.startsWith("/my-children") || pathname.startsWith("/proof-cards")) return "parent";
  if (pathname.startsWith("/student-dashboard") || pathname.startsWith("/my-classes") || pathname.startsWith("/student-homework") || pathname.startsWith("/passport")) return "student";
  return "tutor";
}

function allowedRolesForPath(pathname: string): Role[] {
  if (pathname.startsWith("/admin")) return ["ADMIN"];
  if (pathname.startsWith("/parent-dashboard") || pathname.startsWith("/my-children") || pathname.startsWith("/proof-cards")) return ["PARENT"];
  if (pathname.startsWith("/student-dashboard") || pathname.startsWith("/my-classes") || pathname.startsWith("/student-homework") || pathname.startsWith("/passport")) return ["STUDENT"];
  if (pathname.startsWith("/bookings")) return ["PARENT", "TUTOR"];
  return ["TUTOR"];
}

function roleToShellRole(role: Role): ShellRole {
  if (role === "ADMIN") return "admin";
  if (role === "PARENT") return "parent";
  if (role === "STUDENT") return "student";
  return "tutor";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const hydrate = useAuthStore((state) => state.hydrate);
  const allowedRoles = allowedRolesForPath(pathname);
  const role = user && allowedRoles.includes(user.role) ? roleToShellRole(user.role) : getShellRole(pathname);
  const hasAccess = Boolean(user && allowedRoles.includes(user.role));

  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <main className={cn("tg-noise relative min-h-[calc(100vh-5rem)] overflow-hidden pb-20 md:pb-0", shellThemes[role])}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.24),transparent_42%,rgba(255,255,255,0.16))]" />
      <div className="relative mx-auto flex max-w-[1520px]">
        <Sidebar />
        <section data-shell-role={role} className={cn("min-w-0 flex-1 p-4 shadow-[inset_1px_0_0_rgba(255,255,255,0.5)] backdrop-blur-xl sm:p-6 lg:p-8", panelThemes[role])}>
          <div className="min-h-[calc(100vh-8rem)]">
            {!initialized ? <WorkspaceMessage title="Checking session" body="Loading your secure workspace..." icon="shield" /> : null}
            {initialized && !user ? <WorkspaceMessage title="Sign in required" body="This workspace is connected to your TutorGround account." actionLabel="Sign in" actionHref="/login" icon="lock" /> : null}
            {initialized && user && !hasAccess ? (
              <WorkspaceMessage
                title={`${roleNames[user.role]} account active`}
                body="This tab belongs to another role. Open your correct workspace to keep data and permissions separate."
                actionLabel="Open my workspace"
                actionHref={defaultRouteForRole(user.role)}
                icon="lock"
              />
            ) : null}
            {initialized && hasAccess ? children : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function WorkspaceMessage({
  title,
  body,
  actionLabel,
  actionHref,
  icon
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  icon: "lock" | "shield";
}) {
  const Icon = icon === "lock" ? LockKeyhole : ShieldCheck;
  return (
    <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center">
      <Card className="max-w-xl border-white/70 bg-white/90 shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-amber-200">
            <Icon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
          {actionHref && actionLabel ? (
            <Button asChild className="mt-6">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

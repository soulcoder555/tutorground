"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { BarChart3, BookOpen, CalendarDays, CheckSquare, ClipboardList, Compass, GraduationCap, Home, Map, ShieldCheck, Users, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type ShellRole = "tutor" | "parent" | "student" | "admin";

const roleItems: Record<ShellRole, NavItem[]> = {
  tutor: [
    { href: "/dashboard", label: "Studio overview", icon: Home },
    { href: "/profile", label: "Public profile", icon: ShieldCheck },
    { href: "/sessions", label: "Class schedule", icon: CalendarDays },
    { href: "/bookings", label: "Booking requests", icon: ClipboardList },
    { href: "/students", label: "Students", icon: Users },
    { href: "/homework", label: "Homework", icon: BookOpen },
    { href: "/attendance", label: "Attendance", icon: CheckSquare },
    { href: "/earnings", label: "Earnings", icon: WalletCards }
  ],
  parent: [
    { href: "/parent-dashboard", label: "Parent home", icon: Home },
    { href: "/find-tutors", label: "Teacher finding", icon: Map },
    { href: "/my-children", label: "Child status", icon: GraduationCap },
    { href: "/proof-cards", label: "Proof cards", icon: ClipboardList },
    { href: "/bookings", label: "Bookings", icon: CalendarDays }
  ],
  student: [
    { href: "/student-dashboard", label: "Study desk", icon: Home },
    { href: "/my-classes", label: "Live classes", icon: CalendarDays },
    { href: "/student-homework", label: "Homework", icon: BookOpen },
    { href: "/passport", label: "Passport", icon: ShieldCheck }
  ],
  admin: [
    { href: "/admin/dashboard", label: "Command center", icon: BarChart3 },
    { href: "/admin/tutors", label: "Verifications", icon: ShieldCheck },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 }
  ]
};

const roleMeta: Record<ShellRole, { label: string; title: string; detail: string; className: string }> = {
  tutor: {
    label: "Tutor workspace",
    title: "Teaching studio",
    detail: "Classes, proof cards, reviews, and earnings in one place.",
    className: "from-[#0f172a] via-[#312e81] to-[#7c2d12] text-white"
  },
  parent: {
    label: "Parent workspace",
    title: "Family control room",
    detail: "Track child progress, find teachers, and manage proof.",
    className: "from-[#1b153d] via-[#3b1f4c] to-[#7c2d12] text-white"
  },
  student: {
    label: "Student workspace",
    title: "Focus desk",
    detail: "Classes, homework, weak topics, and achievements.",
    className: "from-slate-950 via-violet-950 to-cyan-950 text-white"
  },
  admin: {
    label: "Admin workspace",
    title: "Operations deck",
    detail: "Verification queue, platform health, and user safety.",
    className: "from-slate-950 via-indigo-950 to-emerald-950 text-white"
  }
};

function getShellRole(pathname: string): ShellRole {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/parent-dashboard") || pathname.startsWith("/find-tutors") || pathname.startsWith("/my-children") || pathname.startsWith("/proof-cards") || pathname.startsWith("/bookings")) return "parent";
  if (pathname.startsWith("/student-dashboard") || pathname.startsWith("/my-classes") || pathname.startsWith("/student-homework") || pathname.startsWith("/passport")) return "student";
  return "tutor";
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const role = pathname.startsWith("/bookings") && user?.role === "TUTOR" ? "tutor" : getShellRole(pathname);
  const meta = roleMeta[role];
  const items = roleItems[role];

  return (
    <aside className={cn("hidden w-80 shrink-0 p-4 md:block", className)}>
      <div className="sticky top-24 space-y-5">
        <div className={cn("tg-lift overflow-hidden rounded-[1.5rem] bg-gradient-to-br p-5 shadow-[0_24px_60px_rgba(15,23,42,0.28)]", meta.className)}>
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <Compass className="h-6 w-6 text-amber-200" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">{meta.label}</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">{meta.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">{meta.detail}</p>
        </div>

        <nav className="rounded-[1.35rem] border border-white/70 bg-white/70 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl" aria-label={meta.label}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                  isActive && "bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:bg-slate-950 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-amber-200" : "text-slate-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, CalendarDays, Home, LogIn, LogOut, Map, ShieldCheck, UserPlus, Users } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { defaultRouteForRole } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/find-tutors", label: "Find", icon: Map },
  { href: "/login", label: "Sign in", icon: LogIn },
  { href: "/signup", label: "Sign up", icon: UserPlus }
];

const workspaceLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/find-tutors", label: "Find tutors", icon: Map },
  { href: "/dashboard", label: "Tutor", icon: CalendarDays },
  { href: "/parent-dashboard", label: "Parent", icon: Users },
  { href: "/passport", label: "Student", icon: ShieldCheck }
];

function isPublicPath(pathname: string) {
  return pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/verify" || pathname === "/find-tutors" || pathname.startsWith("/tutor/");
}

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const logout = useAuthStore((state) => state.logout);
  const links = isPublicPath(pathname)
    ? user
      ? [
          { href: "/", label: "Home", icon: Home },
          { href: "/find-tutors", label: "Find", icon: Map },
          { href: defaultRouteForRole(user.role), label: "Workspace", icon: Briefcase }
        ]
      : publicLinks
    : workspaceLinks;

  React.useEffect(() => {
    void hydrate();
    const openMenu = () => setOpen(true);
    window.addEventListener("tg:open-mobile-menu", openMenu);
    return () => window.removeEventListener("tg:open-mobile-menu", openMenu);
  }, [hydrate]);

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <div className="mb-6 flex items-center gap-3 font-heading text-lg font-bold">
            <LogoMark subtitle={isPublicPath(pathname) ? "Local tutor search" : "Role workspace"} />
          </div>
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {user ? (
            <Button className="mt-6 w-full border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button className="mt-6 w-full" asChild>
              <Link href="/signup">Create account</Link>
            </Button>
          )}
        </SheetContent>
      </Sheet>
      <nav className={`fixed bottom-0 left-0 right-0 z-40 grid border-t border-white/70 bg-[#fff7ed]/90 shadow-[0_-12px_34px_rgba(15,23,42,0.14)] backdrop-blur-xl md:hidden ${links.length === 3 ? "grid-cols-3" : links.length === 4 ? "grid-cols-4" : "grid-cols-5"}`}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-semibold text-slate-600">
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

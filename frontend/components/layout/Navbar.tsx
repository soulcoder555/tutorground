"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Sparkles, UserCircle } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { defaultRouteForRole } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

function isPublicPath(pathname: string) {
  return pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/verify" || pathname === "/find-tutors" || pathname.startsWith("/tutor/");
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const publicPage = isPublicPath(pathname);
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const logout = useAuthStore((state) => state.logout);

  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#fff7ed]/80 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="TutorGround home">
          <LogoMark size="md" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
          <Link className="transition hover:text-slate-950" href="/find-tutors">Find tutors</Link>
          {user ? <Link className="transition hover:text-slate-950" href={defaultRouteForRole(user.role)}>Workspace</Link> : null}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {publicPage ? (
            user ? (
              <>
                <Button asChild variant="outline">
                  <Link href={defaultRouteForRole(user.role)}>Open workspace</Link>
                </Button>
                <Button variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild className="shadow-[0_14px_28px_rgba(79,70,229,0.22)]">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )
          ) : (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs font-bold text-amber-800 lg:flex">
                <Sparkles className="h-4 w-4" />
                Verified session proof
              </div>
              {user ? (
                <>
                  <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 text-sm font-bold text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
                    <UserCircle className="h-4 w-4 text-primary" />
                    {user.name}
                    <span className="text-xs font-bold uppercase text-slate-500">{user.role}</span>
                  </div>
                  <NotificationBell />
                  <Button variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild className="shadow-[0_14px_28px_rgba(79,70,229,0.25)]">
                  <Link href="/login">Sign in</Link>
                </Button>
              )}
            </>
          )}
        </div>
        <Button className="md:hidden" size="icon" variant="outline" aria-label="Open mobile navigation" onClick={() => window.dispatchEvent(new Event("tg:open-mobile-menu"))}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, GraduationCap, Laptop, LockKeyhole, Monitor, Tablet, UserRoundCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultRouteForRole } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});
type FormValues = z.infer<typeof schema>;

const floatingStudyObjects = [
  { icon: BookOpen, className: "left-[7%] top-[15%]", style: { "--rotate": "-10deg", "--x": "18px", "--y": "-20px", "--duration": "8s" } },
  { icon: Laptop, className: "right-[8%] top-[18%]", style: { "--rotate": "8deg", "--x": "-18px", "--y": "-18px", "--duration": "9s" } },
  { icon: Tablet, className: "left-[16%] bottom-[17%]", style: { "--rotate": "12deg", "--x": "14px", "--y": "18px", "--duration": "7.5s" } },
  { icon: Monitor, className: "right-[18%] bottom-[14%]", style: { "--rotate": "-8deg", "--x": "-16px", "--y": "18px", "--duration": "8.5s" } },
  { icon: GraduationCap, className: "left-[46%] top-[9%]", style: { "--rotate": "6deg", "--x": "10px", "--y": "-16px", "--duration": "10s" } }
] as const;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [accountCreated, setAccountCreated] = React.useState(false);

  React.useEffect(() => {
    setAccountCreated(new URLSearchParams(window.location.search).get("created") === "1");
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      await login(values.email, values.password);
      const user = useAuthStore.getState().user;
      router.push(user ? defaultRouteForRole(user.role) : "/dashboard");
    } catch {
      return;
    }
  }

  return (
    <main className="tg-noise relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[linear-gradient(135deg,#070816_0%,#151832_42%,#fff1f2_42%,#fff7ed_72%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(245,158,11,0.24),transparent_26rem),radial-gradient(circle_at_86%_16%,rgba(79,70,229,0.18),transparent_28rem)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {floatingStudyObjects.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`study-float absolute hidden h-20 w-20 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-amber-100 shadow-[0_22px_45px_rgba(2,6,23,0.22)] backdrop-blur-md md:flex ${item.className}`}
              style={item.style as CSSProperties}
            >
              <Icon className="h-9 w-9" />
            </div>
          );
        })}
      </div>

      <section className="relative mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-2xl text-white">
          <div className="flex items-center gap-4">
            <LogoMark size="lg" showText={false} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-200">Secure email login</p>
              <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">Open your TutorGround workspace</h1>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-200">
            Sign in once and TutorGround opens the right workspace for your role: teacher, student, parent, or admin.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Verified", "Session proof"],
              ["Live", "Class updates"],
              ["Portable", "Study record"]
            ].map(([title, detail]) => (
              <div key={title} className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="font-heading text-xl font-bold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-300">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-white/80 bg-[#fff7ed]/90 shadow-[0_30px_90px_rgba(15,23,42,0.24)] backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <UserRoundCheck className="h-4 w-4" />
                Secure session
              </div>
            </div>
            <CardTitle className="text-3xl">Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {accountCreated ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Account created. Sign in with your email.</p> : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="h-12 bg-white/70" {...register("email")} />
                {formState.errors.email ? <p className="text-sm font-medium text-red-700">{formState.errors.email.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Minimum 8 characters" className="h-12 bg-white/70" {...register("password")} />
                {formState.errors.password ? <p className="text-sm font-medium text-red-700">{formState.errors.password.message}</p> : null}
              </div>
              {error ? <p className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm font-bold leading-6 text-red-700">{error}</p> : null}
              <Button className="h-12 w-full text-base shadow-[0_18px_35px_rgba(79,70,229,0.28)]" type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <Link href="/signup" className="font-semibold text-primary">New here? Create account</Link>
              <span className="font-semibold text-slate-700">Email login only</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

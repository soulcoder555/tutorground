"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  role: z.enum(["TUTOR", "STUDENT", "PARENT"]),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/\d/)
});
type FormValues = z.infer<typeof schema>;

const roleCopy = {
  TUTOR: {
    title: "Teacher registration",
    body: "Build your tutor profile, subjects, availability, documents, and teaching studio after email signup."
  },
  STUDENT: {
    title: "Student tab",
    body: "The student tab keeps classes, homework, attendance, weak topics, achievements, and the Learning Passport."
  },
  PARENT: {
    title: "Parent tab",
    body: "The parent tab gives overall child tracking, proof cards, attendance, homework status, and detailed study progress."
  }
} as const;

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const error = useAuthStore((state) => state.error);
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "STUDENT" }
  });
  const role = watch("role");
  const isTeacher = role === "TUTOR";

  async function onSubmit(values: FormValues) {
    try {
      await signup(values);
      router.push("/login?created=1");
    } catch {
      return;
    }
  }

  return (
    <main className="tg-noise min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_8%_4%,rgba(245,158,11,0.2),transparent_26rem),radial-gradient(circle_at_88%_8%,rgba(79,70,229,0.16),transparent_30rem),linear-gradient(135deg,#fff7ed_0%,#fff1f2_48%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[1.65rem] bg-[linear-gradient(135deg,#111827_0%,#312e81_58%,#7c2d12_120%)] p-6 text-white shadow-[0_26px_70px_rgba(15,23,42,0.24)] sm:p-8">
          <LogoMark size="lg" showText={false} />
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-200">TutorGround registration</p>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight">Choose the account type first</h1>
          <p className="mt-4 text-base leading-8 text-slate-200">
            Registration starts with email only for now. Extra verification can be added later when the product is ready for that layer.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              ["Teacher", "Tutor profile, classes, earnings, proof cards"],
              ["Student tab", "Learning passport, classes, homework"],
              ["Parent tab", "Child overview, proof, detailed tracking"]
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-white/15 bg-white/10 p-4">
                <p className="font-heading text-lg font-bold">{title}</p>
                <p className="mt-1 text-sm text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-white/80 bg-[#fff7ed]/90 shadow-[0_28px_70px_rgba(15,23,42,0.14)] backdrop-blur">
          <CardContent className="p-5 sm:p-7">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register("role")} />

              <div>
                <h2 className="font-heading text-3xl font-bold text-slate-950">Create your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Select one path. Student-family includes a Student tab and a Parent tab, so the same product model can later convert cleanly into an app.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setValue("role", "TUTOR", { shouldValidate: true })}
                  className={`rounded-2xl border p-4 text-left transition ${isTeacher ? "border-indigo-500 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]" : "border-white/80 bg-[#fff1f2]/80 text-slate-800 hover:border-indigo-200"}`}
                >
                  <BookOpenCheck className="h-6 w-6 text-amber-400" />
                  <p className="mt-4 font-heading text-xl font-bold">Register as Teacher</p>
                  <p className="mt-2 text-sm leading-6 opacity-80">For home tutors and coaching teachers.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", role === "PARENT" ? "PARENT" : "STUDENT", { shouldValidate: true })}
                  className={`rounded-2xl border p-4 text-left transition ${!isTeacher ? "border-indigo-500 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)]" : "border-white/80 bg-[#fef3c7]/80 text-slate-800 hover:border-indigo-200"}`}
                >
                  <Users className="h-6 w-6 text-amber-400" />
                  <p className="mt-4 font-heading text-xl font-bold">Student family account</p>
                  <p className="mt-2 text-sm leading-6 opacity-80">For student profile plus parent tracking.</p>
                </button>
              </div>

              {!isTeacher ? (
                <div className="rounded-xl border border-rose-100 bg-[#fff1f2] p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setValue("role", "STUDENT", { shouldValidate: true })}
                      className={`rounded-lg px-4 py-3 text-left text-sm font-bold transition ${role === "STUDENT" ? "bg-[#111827] text-white" : "bg-[#fffaf3] text-slate-700"}`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Student tab
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("role", "PARENT", { shouldValidate: true })}
                      className={`rounded-lg px-4 py-3 text-left text-sm font-bold transition ${role === "PARENT" ? "bg-[#111827] text-white" : "bg-[#fffaf3] text-slate-700"}`}
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Parent tab
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="rounded-xl border border-amber-100 bg-[#fff7ed] p-4">
                <p className="font-heading text-lg font-bold text-slate-950">{roleCopy[role].title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{roleCopy[role].body}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" className="h-12 bg-white/70" {...register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" className="h-12 bg-white/70" {...register("email")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" className="h-12 bg-white/70" {...register("password")} />
                </div>
              </div>

              {formState.errors.name ? <p className="text-sm font-medium text-red-700">{formState.errors.name.message}</p> : null}
              {formState.errors.email ? <p className="text-sm font-medium text-red-700">{formState.errors.email.message}</p> : null}
              {formState.errors.password ? <p className="text-sm font-medium text-red-700">Use at least 8 characters, one uppercase letter, and one number.</p> : null}
              {error ? <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
              <Button type="submit" disabled={formState.isSubmitting} className="h-12 px-6">
                {formState.isSubmitting ? "Creating..." : "Create account"}
              </Button>
            </form>
            <p className="mt-5 text-sm text-slate-600">
              Already registered? <Link href="/login" className="font-semibold text-primary">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

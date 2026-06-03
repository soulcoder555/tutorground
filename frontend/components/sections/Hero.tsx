import Link from "next/link";
import { ArrowRight, CalendarCheck, Sparkles, Star } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
  return (
    <section className="tg-noise relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[linear-gradient(135deg,#070816_0%,#121a35_44%,#3b1f4c_72%,#7c2d12_120%)]">
      <div className="tg-grid-glow absolute inset-0 opacity-70" />
      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-rose-400/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="max-w-3xl text-white">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Verified local tutoring marketplace
          </div>
          <h1 className="font-heading text-[clamp(3rem,7vw,5.75rem)] font-extrabold leading-[0.96] tracking-tight">
            Find trusted tutors near you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            TutorGround turns unorganized local tutoring into a structured platform for parents, teachers, and students with booking, live classes, attendance, homework, and verified session proof.
          </p>

          <form action="/find-tutors" className="mt-9 grid gap-3 rounded-2xl border border-white/20 bg-[#fffaf3]/95 p-3 shadow-[0_28px_90px_rgba(2,6,23,0.4)] backdrop-blur sm:grid-cols-[1fr_1fr_auto]">
            <Input name="subject" aria-label="Subject" placeholder="Subject, e.g. Math" className="h-12 border-slate-200 bg-white/75" />
            <Input name="location" aria-label="City or locality" placeholder="City or locality" className="h-12 border-slate-200 bg-white/75" />
            <Button type="submit" className="h-12 px-7">
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/find-tutors">Find a tutor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href="/signup">Create account</Link>
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <div className="flex -space-x-3">
              {["A", "F", "M", "S"].map((letter) => (
                <span key={letter} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 font-bold text-white backdrop-blur">
                  {letter}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              4.8 average tutor rating from verified parent reviews
            </span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -left-10 top-12 h-28 w-28 rotate-[-10deg] rounded-3xl border border-white/20 bg-white/10 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur study-float">
            <LogoMark showText={false} size="lg" />
          </div>
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-[0_36px_100px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
            <div className="rounded-[1.5rem] bg-[#fff7ed] p-5 text-slate-950">
              <HeroDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroDashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Live trust dashboard</p>
          <h2 className="mt-1 font-heading text-2xl font-extrabold">Aarav's weekly progress</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">On track</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["92%", "Attendance"],
          ["88%", "Homework"],
          ["96%", "Tutor punctuality"]
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-amber-100 bg-white/75 p-4">
            <p className="font-heading text-3xl font-extrabold">{value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
        <div className="flex items-start gap-3">
          <CalendarCheck className="mt-1 h-5 w-5 text-indigo-600" />
          <div>
            <p className="font-heading text-lg font-bold">Physics class completed</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Topics: Kinematics, graph interpretation. Proof card delivered to parent.</p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">Teacher finding</p>
          <p className="mt-4 font-heading text-2xl font-bold">14 nearby matches</p>
        </div>
        <div className="rounded-2xl bg-[#fff1f2] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-600">Child status</p>
          <p className="mt-4 font-heading text-2xl font-bold">3 weak topics</p>
        </div>
      </div>
    </>
  );
}

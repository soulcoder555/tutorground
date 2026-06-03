import { Radar } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  ["1", "Register by role", "Teacher or student-family signup keeps permissions clean from the first screen."],
  ["2", "Search and book", "Parents compare real local tutors with map, pricing, trust badges, and reviews."],
  ["3", "Track every class", "Sessions, attendance, homework, proof cards, and notifications keep everyone accountable."]
];

export function ProblemSolution() {
  return (
    <section className="bg-[linear-gradient(135deg,#fff1f2_0%,#fffbeb_48%,#ecfeff_100%)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="flex items-center gap-3">
                <Radar className="h-6 w-6 text-indigo-600" />
                <h2 className="font-heading text-3xl font-extrabold">Problem to solution</h2>
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  ["Before", "WhatsApp groups, word of mouth, no proof after class, and no accountability."],
                  ["After", "Verified profiles, bookings, attendance, proof cards, homework tracking, and parent dashboards."]
                ].map(([label, text]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-[#fffaf3]/85 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-amber-700">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">How it works</p>
            <div className="mt-5 grid gap-4">
              {steps.map(([number, title, body]) => (
                <div key={number} className="flex gap-4 rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 font-heading text-lg font-extrabold text-amber-200">{number}</span>
                  <div>
                    <h3 className="font-heading text-xl font-extrabold text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { BookOpenCheck, GraduationCap, Users } from "lucide-react";
import { Reveal } from "./Reveal";

const rolePreviews = [
  {
    title: "Parent home",
    label: "Child status",
    body: "Three main lanes: child status, teacher finding, and other actions like bookings, proof cards, and payments.",
    icon: Users,
    className: "from-[#1b153d] via-[#3b1f4c] to-[#7c2d12]"
  },
  {
    title: "Teacher studio",
    label: "Teaching operations",
    body: "Classes, student lists, homework review, attendance, profile verification, and earnings are grouped for quick action.",
    icon: BookOpenCheck,
    className: "from-[#0f172a] via-[#312e81] to-[#7c2d12]"
  },
  {
    title: "Student desk",
    label: "Learning passport",
    body: "Classes, homework, strong topics, weak topics, badges, and the permanent learning record stay in one focused place.",
    icon: GraduationCap,
    className: "from-[#020617] via-[#1e1b4b] to-[#0f766e]"
  }
];

export function RolePreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">App structure preview</p>
          <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-slate-950">Three workspaces, separated by real roles.</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            These cards are previews of the product structure. They are not fake tabs for access. During registration, TutorGround asks for teacher or student-family, then opens only the correct workspace.
          </p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {rolePreviews.map((preview, index) => {
            const Icon = preview.icon;
            return (
              <Reveal key={preview.title} delay={index * 0.07}>
                <div className={`tg-lift h-full rounded-[1.45rem] bg-gradient-to-br ${preview.className} p-5 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                    <Icon className="h-6 w-6 text-amber-200" />
                  </div>
                  <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.15em] text-amber-200">{preview.label}</p>
                  <h3 className="mt-2 font-heading text-2xl font-extrabold">{preview.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/75">{preview.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

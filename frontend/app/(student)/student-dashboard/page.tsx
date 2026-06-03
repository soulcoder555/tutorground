import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Medal, Target } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HomeworkCard } from "@/components/homework/HomeworkCard";
import { SessionCard } from "@/components/session/SessionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleHomework, sampleSessions } from "@/lib/sample-data";

const studentActions = [
  { label: "Join classes", href: "/my-classes", icon: CalendarDays },
  { label: "Submit homework", href: "/student-homework", icon: BookOpen },
  { label: "Open passport", href: "/passport", icon: Medal }
];

const studentPulse = [
  { label: "Study streak", value: "14 days", icon: Target },
  { label: "Homework due", value: "2 tasks", icon: BookOpen },
  { label: "Next class", value: "Today", icon: CalendarDays }
];

export default function StudentDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-xl bg-[linear-gradient(120deg,#020617_0%,#312e81_55%,#0f766e_120%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <Badge className="border-cyan-200/30 bg-white/10 text-cyan-50 hover:bg-white/10">Student mode</Badge>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Focus desk</h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-200">
                A darker workspace for classes, homework, weak topics, and your portable Learning Passport.
              </p>
            </div>
            <div className="grid gap-2">
              {studentActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button key={action.label} asChild className="justify-between bg-white text-slate-950 hover:bg-slate-100">
                    <Link href={action.href}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {action.label}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {studentPulse.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-slate-500">{item.label}</p>
                <p className="font-heading text-2xl font-bold text-slate-950">{item.value}</p>
              </div>
            );
          })}
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="border-white/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleSessions.slice(0, 2).map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </CardContent>
          </Card>
          <Card className="border-white/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle>Homework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleHomework.map((homework) => (
                <HomeworkCard key={homework.id} homework={homework} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

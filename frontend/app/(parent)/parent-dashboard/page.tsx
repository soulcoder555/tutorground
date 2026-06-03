import Link from "next/link";
import { ArrowRight, BellRing, CalendarCheck, ClipboardCheck, FileText, GraduationCap, Map, MessageSquare, Search, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const parentHubs = [
  {
    title: "Child status",
    subtitle: "Attendance, homework, proof cards, and monthly learning health.",
    href: "/my-children",
    icon: GraduationCap,
    className: "bg-[linear-gradient(135deg,#111827_0%,#1e1b4b_55%,#f59e0b_160%)] text-white",
    options: [
      { label: "Trust dashboard", href: "/parent-dashboard", icon: ShieldCheck },
      { label: "Proof cards", href: "/proof-cards", icon: ClipboardCheck },
      { label: "Homework tracker", href: "/my-children", icon: FileText }
    ]
  },
  {
    title: "Teacher finding",
    subtitle: "Find nearby verified tutors by subject, fee, class level, and Smart Match.",
    href: "/find-tutors",
    icon: Search,
    className: "bg-[linear-gradient(135deg,#f8fafc_0%,#e0e7ff_48%,#fff7ed_100%)] text-slate-950",
    options: [
      { label: "Map search", href: "/find-tutors", icon: Map },
      { label: "Bookings", href: "/bookings", icon: CalendarCheck },
      { label: "Messages", href: "/bookings", icon: MessageSquare }
    ]
  },
  {
    title: "Other options",
    subtitle: "Payments, alerts, support, profile settings, and upcoming Phase 2 tools.",
    href: "/bookings",
    icon: Sparkles,
    className: "bg-[linear-gradient(135deg,#fefce8_0%,#ffffff_48%,#dbeafe_100%)] text-slate-950",
    options: [
      { label: "Payment scaffold", href: "/bookings", icon: WalletCards },
      { label: "Notifications", href: "/proof-cards", icon: BellRing },
      { label: "Session proof", href: "/proof-cards", icon: ClipboardCheck }
    ]
  }
];

const pulseItems = [
  ["Attendance rate", "94%", "Last 30 days"],
  ["Homework on time", "87%", "Across active tutors"],
  ["Proof delivered", "12", "Verified class cards"],
  ["Open bookings", "3", "Awaiting tutor response"]
];

export default function ParentDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-7">
        <section className="overflow-hidden rounded-xl bg-[linear-gradient(120deg,#0f172a_0%,#312e81_58%,#f59e0b_150%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Badge className="border-amber-300/30 bg-amber-200/20 text-amber-100 hover:bg-amber-200/20">Parent mode</Badge>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Family learning control room</h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-200">
                Three clear lanes: child status, teacher finding, and everything else parents need to keep tutoring accountable.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
              <Link href="/find-tutors">
                Find a teacher
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {parentHubs.map((hub) => {
            const Icon = hub.icon;
            return (
              <Card key={hub.title} className={`overflow-hidden border-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.12)] ${hub.className}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-current/20 bg-white/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Button asChild variant="outline" size="sm" className="border-current/20 bg-white/75 text-slate-950 hover:bg-white">
                      <Link href={hub.href}>Open</Link>
                    </Button>
                  </div>
                  <h2 className="mt-8 font-heading text-2xl font-bold">{hub.title}</h2>
                  <p className="mt-3 min-h-14 text-sm leading-6 opacity-80">{hub.subtitle}</p>
                  <div className="mt-5 space-y-2">
                    {hub.options.map((option) => {
                      const OptionIcon = option.icon;
                      return (
                        <Link key={option.label} href={option.href} className="flex items-center justify-between rounded-lg border border-current/10 bg-white/20 px-4 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
                          <span className="flex items-center gap-2">
                            <OptionIcon className="h-4 w-4" />
                            {option.label}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {pulseItems.map(([label, value, detail]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-2 font-heading text-3xl font-bold text-slate-950">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{detail}</p>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

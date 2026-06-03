import Link from "next/link";
import { ArrowRight, CalendarDays, IndianRupee, Sparkles, Star, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionCard } from "@/components/session/SessionCard";
import { sampleBookings, sampleSessions } from "@/lib/sample-data";

const stats = [
  { label: "Total students", value: "84", icon: Users },
  { label: "Sessions this month", value: "38", icon: CalendarDays },
  { label: "Rating", value: "4.9", icon: Star },
  { label: "Earnings", value: "Rs 42k", icon: IndianRupee }
];

export default function TutorDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-xl bg-[linear-gradient(120deg,#312e81_0%,#111827_58%,#f59e0b_160%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Badge className="border-indigo-200/30 bg-white/10 text-indigo-50 hover:bg-white/10">Tutor mode</Badge>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Teaching studio</h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-200">
                Today classes, booking requests, homework reviews, proof cards, and trust metrics are arranged for quick action.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild className="bg-white text-slate-950 hover:bg-slate-100">
                <Link href="/sessions">
                  Create Session
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/homework">
                  Upload Homework
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-white/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <CardContent className="p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-heading text-2xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <Card className="border-white/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle>Today's Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleSessions.slice(0, 2).map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </CardContent>
          </Card>
          <Card className="border-white/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Pending Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border p-3">
                  <p className="font-semibold">{booking.subject} - Class {booking.classLevel}</p>
                  <p className="text-sm text-muted-foreground">{booking.preferredTime}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" asChild>
                      <Link href="/bookings">Review</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/sessions">Schedule</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import * as React from "react";
import { Activity, CalendarDays, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, getApiErrorMessage } from "@/lib/api";

type Analytics = {
  totalUsers: number;
  sessionsToday: number;
  revenue: number;
  pendingVerifications: number;
  health: {
    api: string;
    database: string;
    realtime: string;
  };
};

const fallback: Analytics = {
  totalUsers: 0,
  sessionsToday: 0,
  revenue: 0,
  pendingVerifications: 0,
  health: { api: "unknown", database: "unknown", realtime: "unknown" }
};

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = React.useState<Analytics>(fallback);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    api
      .get("/admin/analytics")
      .then((response) => setAnalytics(response.data.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError, "Could not load admin analytics.")));
  }, []);

  const stats = [
    { label: "Total users", value: analytics.totalUsers.toLocaleString("en-IN"), icon: Users },
    { label: "Sessions today", value: analytics.sessionsToday.toLocaleString("en-IN"), icon: CalendarDays },
    { label: "Revenue", value: `Rs ${Math.round(analytics.revenue).toLocaleString("en-IN")}`, icon: Activity },
    { label: "Pending checks", value: analytics.pendingVerifications.toLocaleString("en-IN"), icon: ShieldAlert }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#0f172a_0%,#1e3a8a_55%,#065f46_130%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:p-8">
          <Badge className="border-emerald-200/30 bg-white/10 text-emerald-50 hover:bg-white/10">Admin mode</Badge>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Operations deck</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
            Tutor verification, user safety, session logs, and platform health are connected to backend data.
          </p>
        </section>
        {error ? <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-white/80 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <CardContent className="p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-heading text-2xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card className="border-white/80 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Platform health
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {Object.entries(analytics.health).map(([key, value]) => (
              <div key={key} className="rounded-xl border bg-green-50 p-3 text-sm font-semibold capitalize text-green-700">
                {key}: {value}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

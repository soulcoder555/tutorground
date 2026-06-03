"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { city: "Jammu", tutors: 180, sessions: 840 },
  { city: "Kota", tutors: 240, sessions: 1420 },
  { city: "Hisar", tutors: 120, sessions: 530 },
  { city: "Gwalior", tutors: 160, sessions: 680 }
];

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tutors" fill="#4f46e5" />
                  <Bar dataKey="sessions" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-lg bg-slate-50" />
            )}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

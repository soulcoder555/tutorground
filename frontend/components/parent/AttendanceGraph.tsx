"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { attendanceTrend } from "@/lib/sample-data";

export function AttendanceGraph({ data = attendanceTrend }: { data?: typeof attendanceTrend }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-64 rounded-lg bg-slate-50" />;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="present" stackId="a" fill="#22c55e" />
          <Bar dataKey="late" stackId="a" fill="#f59e0b" />
          <Bar dataKey="absent" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

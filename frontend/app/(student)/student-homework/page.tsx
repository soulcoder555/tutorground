"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HomeworkCard } from "@/components/homework/HomeworkCard";
import { api, getApiErrorMessage } from "@/lib/api";
import { sampleHomework } from "@/lib/sample-data";
import type { Homework } from "@/types";

export default function StudentHomeworkPage() {
  const [homework, setHomework] = React.useState<Homework[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    api
      .get("/students/homework")
      .then((response) => setHomework(response.data.data.homework))
      .catch((requestError) => {
        setError(getApiErrorMessage(requestError, "Could not load homework."));
        setHomework(sampleHomework);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-bold">Student homework</h1>
        {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading homework...</p> : null}
        {!loading && !homework.length ? <p className="text-sm text-muted-foreground">No homework assigned yet.</p> : null}
        {homework.map((item) => (
          <HomeworkCard key={item.id} homework={item} />
        ))}
      </div>
    </AppShell>
  );
}

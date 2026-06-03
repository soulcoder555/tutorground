"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeworkCard } from "@/components/homework/HomeworkCard";
import { HomeworkUploadForm } from "@/components/homework/HomeworkUploadForm";
import { SubmissionViewer } from "@/components/homework/SubmissionViewer";
import { api, getApiErrorMessage } from "@/lib/api";
import { sampleHomework } from "@/lib/sample-data";
import type { Homework } from "@/types";

type TutorSessionWithHomework = {
  homework?: Homework[];
};

export default function TutorHomeworkPage() {
  const [homework, setHomework] = React.useState<Homework[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function loadHomework() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/tutors/sessions");
      const sessions = response.data.data.sessions as TutorSessionWithHomework[];
      setHomework(sessions.flatMap((session) => session.homework || []));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not load homework."));
      setHomework(sampleHomework);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadHomework();
  }, []);

  return (
    <AppShell>
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upload homework</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeworkUploadForm onUploaded={loadHomework} />
          </CardContent>
        </Card>
        <div className="space-y-4">
          {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{error}</p> : null}
          {loading ? <p className="text-sm text-muted-foreground">Loading homework...</p> : null}
          {!loading && !homework.length ? <p className="text-sm text-muted-foreground">No homework uploaded yet.</p> : null}
          {homework.map((item) => (
            <HomeworkCard key={item.id} homework={item} />
          ))}
          <SubmissionViewer submissions={homework.flatMap((item) => item.submissions || [])} />
        </div>
      </div>
    </AppShell>
  );
}

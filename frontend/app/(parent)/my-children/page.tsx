"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Link2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getApiErrorMessage } from "@/lib/api";

type Child = {
  id: string;
  class: string;
  subjects: string[];
  user?: {
    name: string;
  };
};

export default function MyChildrenPage() {
  const [children, setChildren] = React.useState<Child[]>([]);
  const [linkCode, setLinkCode] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function loadChildren() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/parents/children");
      setChildren(response.data.data.children);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not load children."));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadChildren();
  }, []);

  async function linkStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await api.post("/parents/link-student", { linkCode });
      setLinkCode("");
      setMessage("Student linked.");
      await loadChildren();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not link student."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Link student</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={linkStudent}>
              <div className="space-y-2">
                <Label htmlFor="linkCode">Student link code</Label>
                <Input id="linkCode" value={linkCode} onChange={(event) => setLinkCode(event.target.value)} placeholder="AB12CD34" required />
              </div>
              <Button type="submit" disabled={submitting}>
                <Link2 className="h-4 w-4" />
                {submitting ? "Linking..." : "Link student"}
              </Button>
            </form>
            {message ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {loading ? <p className="text-sm text-muted-foreground">Loading children...</p> : null}
          {!loading && !children.length ? (
            <Card>
              <CardContent className="p-5">
                <p className="font-heading text-xl font-bold">No students linked yet</p>
                <p className="mt-2 text-sm text-muted-foreground">Ask the student to share the link code from the Student tab.</p>
              </CardContent>
            </Card>
          ) : null}
          {children.map((child) => (
            <Card key={child.id}>
              <CardContent className="p-5">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-heading text-lg font-semibold">{child.user?.name || "Student"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Class {child.class} - {child.subjects.join(", ") || "Subjects not set"}</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href={`/parent-dashboard?studentId=${child.id}`}>Open trust dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

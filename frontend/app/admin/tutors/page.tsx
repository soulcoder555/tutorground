"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, getApiErrorMessage } from "@/lib/api";

type PendingTutor = {
  id: string;
  tutorId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  idProofUrl?: string | null;
  degreeUrl?: string | null;
  photoUrl?: string | null;
  tutor: {
    id: string;
    subjects: string[];
    city: string;
    user: {
      name: string;
      email: string;
    };
  };
};

export default function AdminTutorsPage() {
  const [tutors, setTutors] = React.useState<PendingTutor[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  async function loadTutors() {
    setError(null);
    try {
      const response = await api.get("/admin/tutors/pending");
      setTutors(response.data.data.tutors);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not load tutor verification queue."));
    }
  }

  React.useEffect(() => {
    void loadTutors();
  }, []);

  async function verifyTutor(tutorId: string, status: "APPROVED" | "REJECTED") {
    setError(null);
    setMessage(null);
    try {
      await api.post(`/admin/tutors/${tutorId}/verify`, {
        status,
        notes: status === "APPROVED" ? "Documents approved by admin." : "Please upload clearer documents."
      });
      setTutors((items) => items.filter((item) => item.tutor.id !== tutorId));
      setMessage(status === "APPROVED" ? "Tutor approved." : "Tutor rejected.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not update tutor verification."));
    }
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tutor verification queue</CardTitle>
          </CardHeader>
          <CardContent>
            {message ? <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="mb-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutors.length ? (
                    tutors.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="font-semibold">{item.tutor.user.name}</p>
                          <p className="text-xs text-muted-foreground">{item.tutor.user.email}</p>
                        </TableCell>
                        <TableCell>{item.tutor.subjects.join(", ") || "Not set"}</TableCell>
                        <TableCell>
                          {[item.idProofUrl && "ID", item.degreeUrl && "Degree", item.photoUrl && "Photo"].filter(Boolean).join(", ") || "Pending upload"}
                        </TableCell>
                        <TableCell><Badge variant="warning">{item.status}</Badge></TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" onClick={() => verifyTutor(item.tutor.id, "APPROVED")}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => verifyTutor(item.tutor.id, "REJECTED")}>Reject</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No pending tutors.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarCheck, Send, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { Booking, TeachingMode } from "@/types";

type Child = {
  id: string;
  class: string;
  user?: {
    name: string;
  };
};

type BookingForm = {
  tutorId: string;
  studentId: string;
  subject: string;
  classLevel: string;
  mode: TeachingMode;
  preferredTime: string;
  message: string;
};

const initialForm: BookingForm = {
  tutorId: "",
  studentId: "",
  subject: "Math",
  classLevel: "10",
  mode: "OFFLINE",
  preferredTime: "Mon/Wed 6 PM",
  message: "Need structured support for board exams."
};

export default function BookingsPage() {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [children, setChildren] = React.useState<Child[]>([]);
  const [form, setForm] = React.useState<BookingForm>(initialForm);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    void hydrate();
    setForm((current) => ({ ...current, tutorId: new URLSearchParams(window.location.search).get("tutorId") || current.tutorId }));
  }, [hydrate]);

  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user.role === "TUTOR") {
          const response = await api.get("/bookings");
          setBookings(response.data.data.bookings);
        }
        if (user.role === "PARENT") {
          const [bookingResponse, childResponse] = await Promise.all([
            api.get("/parents/bookings"),
            api.get("/parents/children").catch(() => ({ data: { data: { children: [] } } }))
          ]);
          const loadedChildren = childResponse.data.data.children as Child[];
          setChildren(loadedChildren);
          setBookings(bookingResponse.data.data.bookings);
          setForm((current) => ({ ...current, studentId: current.studentId || loadedChildren[0]?.id || "" }));
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Could not load bookings."));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user]);

  function updateForm<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function sendRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await api.post("/parents/bookings", form);
      setBookings((items) => [response.data.data.booking, ...items]);
      setMessage("Booking request sent to the teacher.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Booking request failed."));
    } finally {
      setSubmitting(false);
    }
  }

  async function respondToBooking(id: string, action: "accept" | "reject") {
    setError(null);
    setMessage(null);
    try {
      const response = await api.patch(`/bookings/${id}/${action}`);
      setBookings((items) => items.map((item) => (item.id === id ? response.data.data.booking : item)));
      setMessage(action === "accept" ? "Booking accepted." : "Booking rejected.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not update booking."));
    }
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#312e81_0%,#111827_60%,#be185d_145%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
            <ShieldCheck className="h-4 w-4" />
            Protected booking flow
          </Badge>
          <h1 className="mt-4 font-heading text-4xl font-bold">Bookings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
            Parents send requests. Teachers accept or reject them. These actions call the TutorGround API directly.
          </p>
        </section>

        {!user ? (
          <Card>
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-heading text-2xl font-bold">Sign in first</p>
                <p className="mt-1 text-sm text-muted-foreground">Bookings are connected to your workspace.</p>
              </div>
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

        {user?.role === "PARENT" ? (
          <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Send request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={sendRequest}>
                  <div>
                    <Label htmlFor="tutorId">Teacher ID</Label>
                    <Input id="tutorId" value={form.tutorId} onChange={(event) => updateForm("tutorId", event.target.value)} placeholder="Paste teacher profile id" required />
                  </div>
                  <div>
                    <Label htmlFor="studentId">Child</Label>
                    {children.length ? (
                      <Select id="studentId" value={form.studentId} onChange={(event) => updateForm("studentId", event.target.value)} required>
                        {children.map((child) => (
                          <option key={child.id} value={child.id}>
                            {child.user?.name || "Child"} - Class {child.class}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input id="studentId" value={form.studentId} onChange={(event) => updateForm("studentId", event.target.value)} placeholder="Student profile ID" required />
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" value={form.subject} onChange={(event) => updateForm("subject", event.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="classLevel">Class</Label>
                      <Input id="classLevel" value={form.classLevel} onChange={(event) => updateForm("classLevel", event.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mode">Mode</Label>
                    <Select id="mode" value={form.mode} onChange={(event) => updateForm("mode", event.target.value as TeachingMode)}>
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                      <option value="BOTH">Both</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="preferredTime">Preferred time</Label>
                    <Input id="preferredTime" value={form.preferredTime} onChange={(event) => updateForm("preferredTime", event.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="bookingMessage">Message</Label>
                    <Textarea id="bookingMessage" value={form.message} onChange={(event) => updateForm("message", event.target.value)} />
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Send request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <BookingList bookings={bookings} loading={loading} />
          </div>
        ) : null}

        {user?.role === "TUTOR" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Incoming requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? <p className="text-sm text-muted-foreground">Loading bookings...</p> : null}
              {!loading && !bookings.length ? <p className="text-sm text-muted-foreground">No booking requests yet.</p> : null}
              {bookings.map((booking) => (
                <div key={booking.id} className="flex flex-col gap-3 rounded-xl border bg-white/85 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{booking.subject} - Class {booking.classLevel}</p>
                    <p className="text-sm text-muted-foreground">{booking.preferredTime}</p>
                    <Badge className="mt-2" variant={booking.status === "PENDING" ? "warning" : booking.status === "ACCEPTED" ? "success" : "secondary"}>{booking.status}</Badge>
                  </div>
                  {booking.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => respondToBooking(booking.id, "accept")}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => respondToBooking(booking.id, "reject")}>Reject</Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}

function BookingList({ bookings, loading }: { bookings: Booking[]; loading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? <p className="text-sm text-muted-foreground">Loading bookings...</p> : null}
        {!loading && !bookings.length ? <p className="text-sm text-muted-foreground">No bookings yet.</p> : null}
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-start justify-between gap-3 rounded-xl border bg-white/85 p-4">
            <div>
              <p className="font-semibold">{booking.subject} - Class {booking.classLevel}</p>
              <p className="text-sm text-muted-foreground">{booking.preferredTime}</p>
            </div>
            <Badge variant={booking.status === "PENDING" ? "warning" : booking.status === "ACCEPTED" ? "success" : "secondary"}>{booking.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

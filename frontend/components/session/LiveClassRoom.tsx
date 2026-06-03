"use client";

import * as React from "react";
import { Hand, LogOut, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { AttendanceMarker } from "./AttendanceMarker";
import { getSocket } from "@/lib/socket";
import { api } from "@/lib/api";
import type { ActivityLevel, AttendanceStatus } from "@/types";

export function LiveClassRoom({
  sessionId,
  userName = "TutorGround User",
  isTutor = true
}: {
  sessionId: string;
  userName?: string;
  isTutor?: boolean;
}) {
  const [seconds, setSeconds] = React.useState(0);
  const [doubts, setDoubts] = React.useState<{ studentId: string; studentName: string; timestamp: string }[]>([]);
  const [proofOpen, setProofOpen] = React.useState(false);
  const [activityLevel, setActivityLevel] = React.useState<ActivityLevel>("HIGH");
  const [topicsCovered, setTopicsCovered] = React.useState("");
  const room = `tutorground-${sessionId}`;
  const jitsiDomain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "meet.jit.si";
  const jitsiUrl = `https://${jitsiDomain}/${room}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName=${encodeURIComponent(userName)}`;

  React.useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    const socket = getSocket();
    socket.connect();
    socket.emit("session:join", { sessionId });
    socket.on("doubt:raised", (payload) => setDoubts((items) => [payload, ...items]));
    return () => {
      window.clearInterval(timer);
      socket.off("doubt:raised");
    };
  }, [sessionId]);

  function raiseDoubt() {
    getSocket().emit("doubt:raised", { sessionId, studentId: "current-student", studentName: userName, timestamp: new Date().toISOString() });
  }

  async function markAttendance(studentId: string, status: AttendanceStatus) {
    await api.post(`/attendance/${sessionId}/mark`, { studentId, status }).catch(() => undefined);
  }

  async function endClass() {
    await api.post(`/sessions/${sessionId}/end`, {
      topicsCovered,
      doubtsSolved: doubts.map((item) => item.studentName).join(", "),
      homeworkAssigned: false,
      studentActivityLevel: activityLevel,
      tutorNotes: "Proof card completed from live room."
    });
    setProofOpen(false);
  }

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = String(seconds % 60).padStart(2, "0");
  const timerTone = minutes >= 75 ? "text-red-600" : minutes >= 60 ? "text-amber-600" : "text-slate-900";

  return (
    <div className="grid min-h-[calc(100vh-4rem)] gap-4 p-4 lg:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <iframe src={jitsiUrl} allow="camera; microphone; fullscreen; display-capture" className="h-[72vh] min-h-[520px] w-full border-0" title="TutorGround live class room" />
      </Card>
      <aside className="space-y-4">
        <Card className="p-4">
          <div className={`flex items-center gap-2 font-heading text-2xl font-bold ${timerTone}`}>
            <Timer className="h-5 w-5" />
            {minutes}:{displaySeconds}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Live session timer</p>
        </Card>
        {isTutor ? (
          <Card className="space-y-3 p-4">
            <h3 className="font-heading font-semibold">Attendance</h3>
            {["student-1", "student-2"].map((studentId) => (
              <div key={studentId} className="rounded-lg border p-3">
                <p className="mb-2 text-sm font-semibold">{studentId}</p>
                <AttendanceMarker studentId={studentId} onMark={markAttendance} />
              </div>
            ))}
          </Card>
        ) : (
          <Button className="w-full" onClick={raiseDoubt}>
            <Hand className="h-4 w-4" />
            Raise Doubt
          </Button>
        )}
        <Card className="p-4">
          <h3 className="font-heading font-semibold">Doubt queue</h3>
          <div className="mt-3 space-y-2">
            {doubts.length ? doubts.map((doubt, index) => <p key={`${doubt.studentId}-${index}`} className="rounded-lg bg-amber-50 p-2 text-sm text-amber-900">{doubt.studentName} raised a doubt</p>) : <p className="text-sm text-muted-foreground">No open doubts.</p>}
          </div>
        </Card>
        {isTutor ? (
          <Button className="w-full" variant="destructive" onClick={() => setProofOpen(true)}>
            <LogOut className="h-4 w-4" />
            End Class
          </Button>
        ) : null}
      </aside>

      <Dialog open={proofOpen} onOpenChange={setProofOpen}>
        <DialogHeader>
          <DialogTitle>Complete Teaching Proof Card</DialogTitle>
          <DialogClose onClick={() => setProofOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <Label>Topics covered today</Label>
              <Textarea value={topicsCovered} onChange={(event) => setTopicsCovered(event.target.value)} />
            </div>
            <div>
              <Label>Student activity level</Label>
              <Select value={activityLevel} onChange={(event) => setActivityLevel(event.target.value as ActivityLevel)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="EXCELLENT">Excellent</option>
              </Select>
            </div>
            <Button onClick={endClass} disabled={!topicsCovered}>Generate Proof Card and End</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

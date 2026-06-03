import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceMarker } from "@/components/session/AttendanceMarker";

export default function TutorAttendancePage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Student 01", "Student 02", "Student 03"].map((student, index) => (
            <div key={student} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">{student}</p>
                <p className="text-sm text-muted-foreground">Session #{index + 1}</p>
              </div>
              <AttendanceMarker studentId={`student-${index + 1}`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

import { AppShell } from "@/components/layout/AppShell";
import { SessionCard } from "@/components/session/SessionCard";
import { sampleSessions } from "@/lib/sample-data";

export default function MyClassesPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-bold">My Classes</h1>
        {sampleSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </AppShell>
  );
}


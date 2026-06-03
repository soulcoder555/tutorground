import Link from "next/link";
import { CalendarClock, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Session } from "@/types";

export function SessionCard({ session }: { session: Session }) {
  const live = session.status === "LIVE";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-semibold">{session.subject}</h3>
              <Badge variant={live ? "success" : session.status === "COMPLETED" ? "secondary" : "blue"}>{session.status}</Badge>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              {formatDate(session.scheduledAt)} - {session.durationMins} mins
            </p>
            <p className="mt-1 text-sm text-slate-600">Class {session.classLevel} - {session.mode}</p>
          </div>
          <Button asChild variant={live ? "success" : "outline"}>
            <Link href={`/live/${session.id}`}>
              <Video className="h-4 w-4" />
              {live ? "Join Live" : "Open Room"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


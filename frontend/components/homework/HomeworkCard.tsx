import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Homework } from "@/types";

export function HomeworkCard({ homework }: { homework: Homework }) {
  const submitted = Boolean(homework.submissions?.length);
  const overdue = new Date(homework.dueDate) < new Date() && !submitted;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold">{homework.title}</h3>
              <Badge variant={submitted ? "success" : overdue ? "danger" : "warning"}>{submitted ? "Submitted" : overdue ? "Overdue" : "Pending"}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">{homework.description}</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Due {formatDate(homework.dueDate)}
            </p>
          </div>
          {homework.fileUrl ? (
            <Button asChild variant="outline" size="sm">
              <Link href={homework.fileUrl}>Open</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>Open</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

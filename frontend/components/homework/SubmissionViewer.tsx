import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { HomeworkSubmission } from "@/types";

export function SubmissionViewer({ submissions }: { submissions: HomeworkSubmission[] }) {
  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{submission.studentId}</p>
                <p className="mt-1 text-sm text-slate-600">{submission.textAnswer || "File submission"}</p>
                {submission.feedback ? <p className="mt-2 text-sm text-muted-foreground">Feedback: {submission.feedback}</p> : null}
              </div>
              <Badge variant={submission.isReviewed ? "success" : "warning"} className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {submission.isReviewed ? `Score ${submission.score}` : "Review"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


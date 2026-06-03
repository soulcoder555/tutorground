import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeakTopicsCard({ weakTopics, strongTopics }: { weakTopics: string[]; strongTopics: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Weak topics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {weakTopics.map((topic) => (
            <Badge key={topic} variant="warning">{topic}</Badge>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Strong topics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {strongTopics.map((topic) => (
            <Badge key={topic} variant="success">{topic}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


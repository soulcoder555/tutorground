import { Badge } from "@/components/ui/badge";

export function SubjectBadge({ subject }: { subject: string }) {
  return <Badge variant="secondary">{subject}</Badge>;
}


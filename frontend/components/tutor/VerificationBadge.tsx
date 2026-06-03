import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const labels = ["Unverified", "Identity Verified", "Degree Verified", "Fully Verified"];
const variants = ["outline", "blue", "purple", "gold"] as const;

export function VerificationBadge({ level }: { level: number }) {
  const safeLevel = Math.max(0, Math.min(level, 3));
  return (
    <Badge variant={variants[safeLevel]} className="gap-1">
      <ShieldCheck className="h-3 w-3" />
      {labels[safeLevel]}
    </Badge>
  );
}


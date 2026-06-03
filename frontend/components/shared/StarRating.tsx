import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, count, className }: { rating: number; count?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 text-sm font-semibold text-slate-800", className)}>
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      <span>{rating.toFixed(1)}</span>
      {count !== undefined ? <span className="font-normal text-muted-foreground">({count} reviews)</span> : null}
    </div>
  );
}


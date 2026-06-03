import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";

export function ReviewCard({ name, studentClass, rating, review, date }: { name: string; studentClass: string; rating: number; review: string; date: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">Student class {studentClass} - Verified parent</p>
          </div>
          <StarRating rating={rating} />
        </div>
        <p className="mt-3 text-sm text-slate-700">{review}</p>
        <p className="mt-3 text-xs text-muted-foreground">{date}</p>
      </CardContent>
    </Card>
  );
}

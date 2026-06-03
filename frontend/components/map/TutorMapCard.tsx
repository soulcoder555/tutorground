import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/StarRating";
import { formatCurrency } from "@/lib/utils";
import type { Tutor } from "@/types";

export function TutorMapCard({ tutor }: { tutor: Tutor }) {
  const name = tutor.user?.name || "Tutor";
  return (
    <div className="w-64 rounded-xl bg-white p-3 shadow-xl">
      <div className="flex gap-3">
        <Avatar name={name} src={tutor.user?.avatarUrl} />
        <div>
          <p className="font-semibold">{name}</p>
          <StarRating rating={tutor.ratingAvg} />
          <p className="text-xs text-muted-foreground">{formatCurrency(tutor.hourlyRate)}/hr - {tutor.distanceKm?.toFixed(1)} km</p>
        </div>
      </div>
      <Button asChild size="sm" className="mt-3 w-full">
        <Link href={`/tutor/${tutor.profileUrl}`}>View Profile</Link>
      </Button>
    </div>
  );
}

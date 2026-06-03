import Link from "next/link";
import { MapPin, Video, WalletCards } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Tutor } from "@/types";
import { StarRating } from "@/components/shared/StarRating";
import { SubjectBadge } from "./SubjectBadge";
import { VerificationBadge } from "./VerificationBadge";

const modeVariant = {
  ONLINE: "blue",
  OFFLINE: "success",
  BOTH: "default"
} as const;

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const name = tutor.user?.name || "Tutor";
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Avatar name={name} src={tutor.user?.avatarUrl} className="h-16 w-16" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-semibold">{name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StarRating rating={tutor.ratingAvg} count={tutor.totalReviews} />
                  <VerificationBadge level={tutor.verificationLevel} />
                </div>
              </div>
              <Badge variant={modeVariant[tutor.teachingMode]} className="gap-1">
                <Video className="h-3 w-3" />
                {tutor.teachingMode}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tutor.subjects.slice(0, 4).map((subject) => (
                <SubjectBadge key={subject} subject={subject} />
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {tutor.distanceKm ? `${tutor.distanceKm.toFixed(1)} km` : tutor.city}
              </span>
              <span className="flex items-center gap-2">
                <WalletCards className="h-4 w-4 text-slate-400" />
                {formatCurrency(tutor.hourlyRate)}/hr
              </span>
              <span>Match score {Math.round(tutor.smartMatchScore || 0)}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href={`/tutor/${tutor.profileUrl}`}>View Profile</Link>
              </Button>
              <Button asChild>
                <Link href={`/bookings?tutorId=${tutor.id}`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


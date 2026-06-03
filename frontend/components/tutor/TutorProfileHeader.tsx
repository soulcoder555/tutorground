import Link from "next/link";
import { CalendarDays, MapPin, Share2, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";
import { formatCurrency } from "@/lib/utils";
import type { Tutor } from "@/types";
import { VerificationBadge } from "./VerificationBadge";

export function TutorProfileHeader({ tutor }: { tutor: Tutor }) {
  const name = tutor.user?.name || "Tutor";
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <Avatar name={name} src={tutor.user?.avatarUrl} className="h-20 w-20" />
            <div>
              <h1 className="font-heading text-3xl font-bold text-slate-950">{name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <VerificationBadge level={tutor.verificationLevel} />
                {tutor.ratingAvg >= 4.8 && tutor.totalReviews >= 20 ? <Badge variant="gold">Top Rated</Badge> : null}
                {tutor.totalReviews >= 10 ? <Badge variant="success">Parent Recommended</Badge> : null}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <StarRating rating={tutor.ratingAvg} count={tutor.totalReviews} />
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {tutor.city}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {tutor.experienceYears} years
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {tutor.studentCount} students
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <div className="mr-2 text-right">
              <p className="text-xs text-muted-foreground">Hourly rate</p>
              <p className="font-heading text-2xl font-bold">{formatCurrency(tutor.hourlyRate)}</p>
            </div>
            <Button asChild>
              <Link href={`/bookings?tutorId=${tutor.id}`}>Book Now</Link>
            </Button>
            <Button variant="outline" size="icon" aria-label="Share profile">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TutorCard } from "@/components/tutor/TutorCard";
import { TutorProfileHeader } from "@/components/tutor/TutorProfileHeader";
import { ReviewCard } from "@/components/tutor/ReviewCard";
import { sampleTutors } from "@/lib/sample-data";
import type { Tutor } from "@/types";

type PublicProfileResponse = {
  profile: Tutor & {
    reviews?: Array<{
      id: string;
      rating: number;
      writtenReview: string;
      createdAt: string;
      parent?: { user?: { name?: string } };
      student?: { class?: string };
    }>;
    availability?: Array<{ id: string; dayOfWeek: number; startTime: string; endTime: string }>;
  };
  similarTutors: Tutor[];
};

async function getTutor(profileUrl: string): Promise<PublicProfileResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  try {
    const response = await fetch(`${apiUrl}/tutors/${profileUrl}`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.data as PublicProfileResponse;
  } catch {
    return null;
  }
}

export default async function PublicTutorProfilePage({ params }: { params: { profileUrl: string } }) {
  const liveProfile = await getTutor(params.profileUrl);
  const tutor = liveProfile?.profile || sampleTutors.find((item) => item.profileUrl === params.profileUrl) || sampleTutors[0];
  if (!tutor) notFound();
  const similarTutors = liveProfile?.similarTutors?.length ? liveProfile.similarTutors : sampleTutors.filter((item) => item.id !== tutor.id).slice(0, 2);
  const reviews = liveProfile?.profile.reviews || [];

  return (
    <main className="bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_52%,#eef2ff_100%)]">
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <TutorProfileHeader tutor={tutor} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-7 text-slate-700">{tutor.bio}</p>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary">{subject}</Badge>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">Qualifications</p>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                  {tutor.qualifications.map((qualification) => (
                    <li key={qualification}>{qualification}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-700">Teaching style: {tutor.teachingStyle}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Parent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviews.length ? (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    name={review.parent?.user?.name || "Verified parent"}
                    studentClass={review.student?.class || "Student"}
                    rating={review.rating}
                    review={review.writtenReview}
                    date={new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  />
                ))
              ) : (
                <>
                  <ReviewCard name="Verified parent" studentClass="10" rating={5} review="Proof cards helped us finally understand what was happening in each class. The tutor is punctual and very clear." date="12 May 2026" />
                  <ReviewCard name="Board exam parent" studentClass="12" rating={4.8} review="Good structure, weekly homework feedback, and genuine parent communication." date="28 Apr 2026" />
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Total students</span><strong>{tutor.studentCount}</strong></div>
              <div className="flex justify-between"><span>Sessions completed</span><strong>{tutor.totalSessions}</strong></div>
              <div className="flex justify-between"><span>Punctuality</span><strong>{tutor.punctualityScore}%</strong></div>
              <div className="flex justify-between"><span>Response rate</span><strong>{tutor.responseRate}%</strong></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Availability Preview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              {(liveProfile?.profile.availability?.length ? liveProfile.profile.availability.map((slot) => `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][slot.dayOfWeek]} ${slot.startTime}`) : ["Mon 6 PM", "Wed 6 PM", "Fri 5 PM", "Sun 10 AM"]).map((slot) => (
                <span key={slot} className="rounded-lg border bg-slate-50 px-3 py-2">{slot}</span>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Similar Tutors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {similarTutors.map((item) => (
                <TutorCard key={item.id} tutor={item} />
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
      </section>
    </main>
  );
}

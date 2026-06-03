import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { TutorMap } from "@/components/map/TutorMap";
import { Button } from "@/components/ui/button";

export default function FindTutorsPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_52%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1480px] space-y-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[#fffaf3] px-4 py-2 text-sm font-bold text-amber-800">
              <MapPin className="h-4 w-4" />
              Public tutor search
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Find trusted tutors near you</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Search first, then sign in or sign up when you are ready to book, track classes, and receive proof cards.
            </p>
          </div>
          <div className="rounded-xl bg-[linear-gradient(135deg,#111827,#312e81)] p-5 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
            <ShieldCheck className="h-6 w-6 text-amber-300" />
            <p className="mt-4 font-heading text-xl font-bold">Need tracking after booking?</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Create a student-family account to unlock Student and Parent tabs.</p>
            <Button asChild className="mt-4 bg-[#fffaf3] text-slate-950 hover:bg-white">
              <Link href="/signup">
                Sign up
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <TutorMap />
      </section>
    </main>
  );
}

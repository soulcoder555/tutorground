import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="tg-aurora mx-auto max-w-7xl rounded-[2rem] bg-[linear-gradient(135deg,#111827,#312e81,#7c2d12,#111827)] p-8 text-white shadow-[0_32px_100px_rgba(15,23,42,0.3)] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-200">Ready to organize tutoring</p>
              <h2 className="mt-3 font-heading text-4xl font-extrabold">Start with a clean role-based account.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Teacher, student, and parent flows stay separated so the web platform can later convert into a mobile app without redesigning the information architecture.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="bg-white text-slate-950 hover:bg-amber-50">
              <Link href="/signup">
                Sign up
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

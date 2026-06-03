import { CheckCircle2 } from "lucide-react";

const proofItems = ["Verified tutors", "Parent-visible accountability", "App-ready role workspaces"];

export function SocialProofBar() {
  return (
    <section className="border-y border-amber-100/70 bg-[#fffaf3]/70 py-6">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 text-sm font-bold text-slate-600 sm:grid-cols-3 sm:px-6 lg:px-8">
        {proofItems.map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

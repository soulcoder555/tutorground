import { ClipboardCheck, MapPin, ShieldCheck, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "./Reveal";

const features = [
  { title: "Verified tutor profiles", body: "Identity, qualification, reviews, response rate, and proof history stay visible before a parent books.", icon: ShieldCheck, tone: "bg-indigo-50 text-indigo-700" },
  { title: "Nearby tutor map", body: "Parents search by subject, class, distance, mode, fee, rating, and Smart Match Score.", icon: MapPin, tone: "bg-sky-50 text-sky-700" },
  { title: "Live class control", body: "Jitsi room links, attendance, doubt queue, and real-time class status are built into every session.", icon: Video, tone: "bg-emerald-50 text-emerald-700" },
  { title: "Teaching proof cards", body: "After class, parents receive a verified summary with topics, activity, homework, timing, and tutor notes.", icon: ClipboardCheck, tone: "bg-amber-50 text-amber-700" }
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Reveal key={feature.title} delay={index * 0.06}>
              <Card className="tg-lift h-full border-white/80 bg-white/70">
                <CardContent className="p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.tone}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-extrabold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

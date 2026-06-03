import { Reveal } from "./Reveal";

const metrics = [
  ["1,200+", "Verified tutors"],
  ["38", "Active cities"],
  ["74,000+", "Sessions tracked"]
];

export function Metrics() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:px-8">
      {metrics.map(([value, label], index) => (
        <Reveal key={label} delay={index * 0.08}>
          <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.1)] backdrop-blur">
            <p className="font-heading text-5xl font-extrabold text-indigo-600">{value}</p>
            <p className="mt-2 text-sm font-bold text-slate-600">{label}</p>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

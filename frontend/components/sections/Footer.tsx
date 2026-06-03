import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";

type FooterGroup = {
  title: string;
  items: string[];
};

const footerGroups: FooterGroup[] = [
  { title: "Platform", items: ["Find tutors", "Teacher signup", "Live classes", "Proof cards"] },
  { title: "Workspaces", items: ["Parent home", "Teacher studio", "Student desk", "Admin"] },
  { title: "Trust", items: ["Verification", "Attendance", "Homework", "Reviews"] }
];

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-[#fff7ed]/80 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <LogoMark />
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            TutorGround is a local tutoring marketplace and accountability platform built for parents, teachers, and students.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {footerGroups.map(({ title, items }) => (
            <div key={title}>
              <p className="font-heading text-sm font-extrabold text-slate-950">{title}</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                {items.map((item) => (
                  <Link key={item} href="/" className="transition hover:text-indigo-600">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

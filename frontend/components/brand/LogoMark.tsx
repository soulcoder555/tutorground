import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitle?: string;
  className?: string;
};

const sizeClass = {
  sm: "h-11 w-11 p-1.5",
  md: "h-14 w-14 p-2",
  lg: "h-20 w-20 p-2.5"
} as const;

export function LogoMark({ size = "md", showText = true, subtitle = "Trusted local learning", className }: LogoMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className={cn("tg-logo-orb", sizeClass[size])}>
        <Image src="/tutorground-logo.png" alt="TutorGround logo" width={160} height={160} priority={size === "lg"} className="relative z-10 h-full w-full rounded-full object-contain" />
      </span>
      {showText ? (
        <span className="leading-tight">
          <span className="block font-heading text-xl font-extrabold tracking-tight text-slate-950">TutorGround</span>
          <span className="block text-xs font-bold text-amber-600">{subtitle}</span>
        </span>
      ) : null}
    </span>
  );
}

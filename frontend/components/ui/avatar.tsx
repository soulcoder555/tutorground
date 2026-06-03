import * as React from "react";
import Image from "next/image";
import { cn, initials } from "@/lib/utils";

export function Avatar({ name, src, className }: { name: string; src?: string | null; className?: string }) {
  return (
    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700", className)}>
      {src ? <Image src={src} alt={name} width={96} height={96} unoptimized className="h-full w-full object-cover" /> : initials(name)}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Sheet({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 md:hidden">
      <button className="absolute inset-0 h-full w-full" aria-label="Close menu" onClick={() => onOpenChange(false)} />
      <aside className="relative h-full w-80 max-w-[85vw] bg-white shadow-2xl">{children}</aside>
    </div>
  );
}

export function SheetContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-full p-5", className)} {...props} />;
}


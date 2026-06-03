"use client";

import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileUpload({ label, onChange, className }: { label: string; onChange?: (file: File | null) => void; className?: string }) {
  return (
    <label className={cn("flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center hover:bg-slate-50", className)}>
      <UploadCloud className="mb-2 h-6 w-6 text-primary" />
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="mt-1 text-xs text-muted-foreground">PDF, JPG, JPEG, or PNG up to 10MB</span>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(event) => onChange?.(event.target.files?.[0] || null)}
      />
    </label>
  );
}


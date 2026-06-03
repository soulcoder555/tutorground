"use client";

import { Input } from "@/components/ui/input";

export function OTPInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Input
          key={index}
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(event) => {
            const next = value.split("");
            next[index] = event.target.value.replace(/\D/g, "");
            onChange(next.join("").slice(0, 6));
          }}
          className="h-12 text-center text-lg font-bold"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}


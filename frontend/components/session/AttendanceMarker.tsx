"use client";

import type { ComponentType } from "react";
import { Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AttendanceStatus } from "@/types";

const options: { status: AttendanceStatus; label: string; icon: ComponentType<{ className?: string }>; variant: "success" | "secondary" | "destructive" }[] = [
  { status: "PRESENT", label: "Present", icon: Check, variant: "success" },
  { status: "LATE", label: "Late", icon: Clock, variant: "secondary" },
  { status: "ABSENT", label: "Absent", icon: X, variant: "destructive" }
];

export function AttendanceMarker({ studentId, onMark }: { studentId: string; onMark?: (studentId: string, status: AttendanceStatus) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <Button key={option.status} size="sm" variant={option.variant} onClick={() => onMark?.(studentId, option.status)}>
            <Icon className="h-3 w-3" />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

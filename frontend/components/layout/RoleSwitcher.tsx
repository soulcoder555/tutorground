"use client";

import { usePathname, useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { defaultRouteForRole } from "@/lib/auth";
import type { Role } from "@/types";

const roles: Role[] = ["PARENT", "TUTOR", "STUDENT", "ADMIN"];

function roleForPath(pathname: string): Role {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/student-dashboard") || pathname.startsWith("/my-classes") || pathname.startsWith("/student-homework") || pathname.startsWith("/passport")) return "STUDENT";
  if (pathname.startsWith("/parent-dashboard") || pathname.startsWith("/find-tutors") || pathname.startsWith("/my-children") || pathname.startsWith("/proof-cards") || pathname.startsWith("/bookings")) return "PARENT";
  return "TUTOR";
}

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Select
      aria-label="Switch role area"
      className="w-40 border-indigo-200 bg-white/90 font-semibold"
      value={roleForPath(pathname)}
      onChange={(event) => router.push(defaultRouteForRole(event.target.value as Role))}
    >
      {roles.map((role) => (
        <option key={role} value={role}>
          {role[0] + role.slice(1).toLowerCase()}
        </option>
      ))}
    </Select>
  );
}

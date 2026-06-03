"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LearningPassport } from "@/components/student/LearningPassport";
import { api, getApiErrorMessage } from "@/lib/api";
import { samplePassport } from "@/lib/sample-data";
import type { Passport } from "@/types";

export default function PassportPage() {
  const [passport, setPassport] = React.useState<Passport>(samplePassport);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    api
      .get("/students/passport")
      .then((response) => setPassport(response.data.data.passport))
      .catch((requestError) => setError(getApiErrorMessage(requestError, "Could not load passport.")));
  }, []);

  return (
    <AppShell>
      {error ? <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{error}</p> : null}
      <LearningPassport passport={passport} />
    </AppShell>
  );
}

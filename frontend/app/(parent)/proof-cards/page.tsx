"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProofCard } from "@/components/parent/ProofCard";
import { api, getApiErrorMessage } from "@/lib/api";
import { sampleProofCards } from "@/lib/sample-data";
import type { ProofCard as ProofCardType } from "@/types";

export default function ProofCardsPage() {
  const [proofCards, setProofCards] = React.useState<ProofCardType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    api
      .get("/parents/proof-cards")
      .then((response) => setProofCards(response.data.data.proofCards))
      .catch((requestError) => {
        setError(getApiErrorMessage(requestError, "Could not load proof cards."));
        setProofCards(sampleProofCards);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="font-heading text-3xl font-bold">Teaching proof cards</h1>
          <p className="mt-1 text-muted-foreground">Verified session summaries delivered after each completed class.</p>
        </div>
        {error ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading proof cards...</p> : null}
        {!loading && !proofCards.length ? <p className="text-sm text-muted-foreground">No proof cards yet.</p> : null}
        <div className="grid gap-4 lg:grid-cols-2">
          {proofCards.map((card) => (
            <ProofCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import * as React from "react";
import { Download, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { ProofCard as ProofCardType } from "@/types";

const activityVariant = {
  LOW: "danger",
  MEDIUM: "warning",
  HIGH: "success",
  EXCELLENT: "gold"
} as const;

export function ProofCard({ card }: { card: ProofCardType }) {
  const ref = React.useRef<HTMLDivElement>(null);

  async function exportPdf() {
    if (!ref.current) return;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
    const canvas = await html2canvas(ref.current);
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);
    pdf.save(`tutorground-proof-${card.sessionId}.pdf`);
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div ref={ref} className="relative overflow-hidden rounded-xl border bg-white p-5">
          <div className="absolute right-4 top-4 rotate-12 text-xs font-bold uppercase tracking-wider text-slate-200">Verified Session</div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-heading text-xl font-bold text-primary">TutorGround</p>
              <p className="text-sm text-muted-foreground">{card.tutor?.user?.name || "Tutor"} - verified class summary</p>
            </div>
            <Badge variant={activityVariant[card.studentActivityLevel]}>{card.studentActivityLevel}</Badge>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <section>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Topics covered</p>
              <p className="mt-1 text-sm text-slate-800">{card.topicsCovered}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Doubts solved</p>
              <p className="mt-1 text-sm text-slate-800">{card.doubtsSolved || "No pending doubts recorded."}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Homework</p>
              <p className="mt-1 text-sm text-slate-800">{card.homeworkAssigned ? card.homeworkDetails : "No homework assigned."}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Duration</p>
              <p className="mt-1 text-sm text-slate-800">{card.durationMins} minutes</p>
            </section>
          </div>
          {card.tutorNotes ? <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{card.tutorNotes}</p> : null}
          <div className="mt-5 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <span>{formatDate(card.generatedAt)}</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Verified Session
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4" onClick={exportPdf}>
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </CardContent>
    </Card>
  );
}


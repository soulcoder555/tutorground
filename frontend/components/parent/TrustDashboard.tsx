import { ClipboardCheck, GraduationCap, Home, TimerReset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleHomework, sampleProofCards } from "@/lib/sample-data";
import { percent } from "@/lib/utils";
import { AttendanceGraph } from "./AttendanceGraph";
import { ChildSelector } from "./ChildSelector";
import { ProofCard } from "./ProofCard";

const overview = [
  { label: "Tutor punctuality", value: 96, icon: TimerReset },
  { label: "Attendance rate", value: 88, icon: Home },
  { label: "Homework completion", value: 82, icon: ClipboardCheck },
  { label: "Teaching quality", value: 91, icon: GraduationCap }
];

export function TrustDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Parent Trust Dashboard</h1>
          <p className="mt-1 text-muted-foreground">One child, one clear view of teaching quality and accountability.</p>
        </div>
        <div className="w-full sm:w-64">
          <ChildSelector />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {overview.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
                <p className="font-heading text-2xl font-bold">{percent(item.value)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceGraph />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Homework Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleHomework.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Badge variant={item.submissions?.length ? "success" : "warning"}>{item.submissions?.length ? "Submitted" : "Pending"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-700">Student 01 attended 7 out of 8 classes this month. Topics covered: quadratic equations, linear equations, motion numericals. Homework completion: 82%. Tutor was on time 96% of sessions.</p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {sampleProofCards.slice(0, 2).map((card) => (
            <ProofCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

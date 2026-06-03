import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { samplePassport } from "@/lib/sample-data";
import type { Passport } from "@/types";
import { ProgressGraph } from "./ProgressGraph";
import { WeakTopicsCard } from "./WeakTopicsCard";

export function LearningPassport({ passport = samplePassport }: { passport?: Passport }) {
  const stats = [
    { label: "Sessions", value: passport.totalSessions, icon: GraduationCap },
    { label: "Subjects", value: passport.subjectsStudied.length, icon: BookOpen },
    { label: "Teachers", value: passport.teachersHistory.length, icon: Users },
    { label: "Badges", value: passport.achievements.length, icon: Award }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Learning Passport</h1>
        <p className="mt-1 text-muted-foreground">A portable record that stays with the student across tutors.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
                <p className="font-heading text-2xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <WeakTopicsCard weakTopics={passport.weakTopics} strongTopics={passport.strongTopics} />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Homework Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressGraph />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Achievement Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {passport.achievements.map((achievement) => (
              <Badge key={achievement} variant="gold">{achievement}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


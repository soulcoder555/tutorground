import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/FileUpload";
import { sampleTutors } from "@/lib/sample-data";

export default function TutorProfilePage() {
  const tutor = sampleTutors[0];
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Tutor Profile Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Subjects</Label>
              <Input defaultValue={tutor.subjects.join(", ")} />
            </div>
            <div>
              <Label>Classes</Label>
              <Input defaultValue={tutor.classesTeaching.join(", ")} />
            </div>
            <div>
              <Label>Hourly rate</Label>
              <Input type="number" defaultValue={tutor.hourlyRate} />
            </div>
            <div>
              <Label>Profile URL</Label>
              <Input defaultValue={tutor.profileUrl} />
            </div>
            <div>
              <Label>City</Label>
              <Input defaultValue={tutor.city} />
            </div>
            <div>
              <Label>Address</Label>
              <Input defaultValue="Gandhi Nagar" />
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea defaultValue={tutor.bio} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FileUpload label="Identity proof" />
            <FileUpload label="Degree certificate" />
            <FileUpload label="Profile photo" />
          </div>
          <Button>Save Profile</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}


import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const students = [
  ["Student 01", "10", "Math, Physics", "88%"],
  ["Student 02", "8", "English, Hindi", "94%"],
  ["Student 03", "12", "Physics", "79%"]
];

export default function TutorStudentsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(([name, classLevel, subjects, attendance]) => (
                <TableRow key={name}>
                  <TableCell className="flex items-center gap-2"><Avatar name={name} /> {name}</TableCell>
                  <TableCell>{classLevel}</TableCell>
                  <TableCell>{subjects}</TableCell>
                  <TableCell>{attendance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}

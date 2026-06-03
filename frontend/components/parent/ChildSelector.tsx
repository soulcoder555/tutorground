import { Select } from "@/components/ui/select";

export function ChildSelector({ childrenNames = ["Student 01", "Student 02"] }: { childrenNames?: string[] }) {
  return (
    <Select aria-label="Select child" defaultValue={childrenNames[0]}>
      {childrenNames.map((name) => (
        <option key={name}>{name}</option>
      ))}
    </Select>
  );
}

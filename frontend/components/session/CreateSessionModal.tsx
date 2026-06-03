"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";

const schema = z.object({
  subject: z.string().min(1),
  classLevel: z.string().min(1),
  scheduledAt: z.string().min(1),
  durationMins: z.coerce.number().int().min(15).max(240),
  mode: z.enum(["ONLINE", "OFFLINE", "BOTH"]),
  studentIds: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function CreateSessionModal({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCreated?: () => void }) {
  const [message, setMessage] = React.useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject: "Math", classLevel: "10", durationMins: 60, mode: "ONLINE" }
  });

  async function onSubmit(values: FormValues) {
    setMessage(null);
    try {
      await api.post("/sessions", { ...values, studentIds: values.studentIds.split(",").map((item) => item.trim()) });
      setMessage("Session created.");
      onCreated?.();
      onOpenChange(false);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Could not create session"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Create Session</DialogTitle>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label>Subject</Label>
            <Input {...register("subject")} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label>Class level</Label>
              <Input {...register("classLevel")} />
            </div>
            <div>
              <Label>Duration</Label>
              <Input type="number" {...register("durationMins")} />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label>Scheduled at</Label>
              <Input type="datetime-local" {...register("scheduledAt")} />
            </div>
            <div>
              <Label>Mode</Label>
              <Select {...register("mode")}>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="BOTH">Both</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Student IDs</Label>
            <Input placeholder="student_1, student_2" {...register("studentIds")} />
          </div>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          <Button type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? "Creating..." : "Create Session"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

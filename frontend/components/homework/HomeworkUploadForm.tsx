"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/shared/FileUpload";
import { api, getApiErrorMessage } from "@/lib/api";

const schema = z.object({
  sessionId: z.string().min(1),
  studentIds: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional(),
  dueDate: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function HomeworkUploadForm({ onUploaded }: { onUploaded?: () => void }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) => form.append(key, key === "studentIds" ? JSON.stringify(value.split(",").map((item) => item.trim())) : value || ""));
    if (file) form.append("file", file);
    try {
      await api.post("/homework", form, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("Homework uploaded and notifications sent.");
      onUploaded?.();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Upload failed"));
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Session ID</Label>
          <Input {...register("sessionId")} />
        </div>
        <div>
          <Label>Student IDs</Label>
          <Input placeholder="student_1, student_2" {...register("studentIds")} />
        </div>
      </div>
      <div>
        <Label>Title</Label>
        <Input {...register("title")} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} />
      </div>
      <div>
        <Label>Due date</Label>
        <Input type="datetime-local" {...register("dueDate")} />
      </div>
      <FileUpload label="Attach homework file" onChange={setFile} />
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? "Uploading..." : "Upload Homework"}</Button>
    </form>
  );
}

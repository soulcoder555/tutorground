"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/shared/OTPInput";
import { api } from "@/lib/api";

function VerifyContent() {
  const params = useSearchParams();
  const phone = params.get("phone") || "";
  const [otp, setOtp] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);

  async function sendOtp() {
    const response = await api.post("/auth/send-otp", { phone });
    setMessage(response.data.data.devOtp ? `Development OTP: ${response.data.data.devOtp}` : "OTP sent.");
  }

  async function verify() {
    try {
      await api.post("/auth/verify-otp", { phone, otp });
      setMessage("Phone verified. You can now login and complete onboarding.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP verification failed");
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify phone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Enter the six-digit OTP sent to {phone || "your phone"}.</p>
          <OTPInput value={otp} onChange={setOtp} />
          {message ? <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}
          <div className="flex gap-2">
            <Button variant="outline" onClick={sendOtp}>Send OTP</Button>
            <Button onClick={verify} disabled={otp.length !== 6}>Verify</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-12">Loading verification...</main>}>
      <VerifyContent />
    </Suspense>
  );
}

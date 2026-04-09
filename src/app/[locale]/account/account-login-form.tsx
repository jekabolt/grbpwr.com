"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export function AccountLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function requestLink() {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/account/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? "Could not send login email");
        return;
      }
      setStep("code");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode() {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/account/login/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? "Invalid code");
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {step === "email" ? (
        <>
          <div>
            <Text variant="uppercase" className="mb-2 block">
              email
            </Text>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              disabled={pending}
            />
          </div>
          <Button
            type="button"
            variant="main"
            size="lg"
            className="w-full"
            disabled={pending || !email.trim()}
            onClick={requestLink}
          >
            continue
          </Button>
        </>
      ) : (
        <>
          <div>
            <Text variant="uppercase" className="mb-2 block">
              code from email
            </Text>
            <Input
              name="code"
              type="text"
              autoComplete="one-time-code"
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCode(e.target.value)
              }
              disabled={pending}
            />
          </div>
          <Button
            type="button"
            variant="main"
            size="lg"
            className="w-full"
            disabled={pending || !code.trim()}
            onClick={verifyCode}
          >
            sign in
          </Button>
          <button
            type="button"
            className="text-left text-textBaseSize uppercase underline disabled:opacity-50"
            disabled={pending}
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
          >
            use a different email
          </button>
        </>
      )}
      {error ? (
        <Text variant="uppercase" className="text-red-600">
          {error}
        </Text>
      ) : null}
    </div>
  );
}

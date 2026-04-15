"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { currencySymbols } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { Text } from "@/components/ui/text";

export function AccountLoginForm({
  isCheckout = true,
}: {
  isCheckout?: boolean;
}) {
  const router = useRouter();
  const { currentCountry } = useTranslationsStore((s) => s);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [pending, setPending] = useState(false);

  async function requestLink() {
    setPending(true);
    try {
      await fetch("/api/account/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setStep("code");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode() {
    setPending(true);
    try {
      await fetch("/api/account/login/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {step === "email" ? (
        <div className="space-y-10">
          <div className="flex flex-col items-center gap-6">
            <Text variant="uppercase">logn or create account</Text>
            <Text variant="uppercase">
              your are in country: {currentCountry.name} /{" "}
              {
                currencySymbols[
                  currentCountry.currencyKey as keyof typeof currencySymbols
                ]
              }{" "}
              change location
            </Text>
          </div>
          <div>
            <Text variant="uppercase">email</Text>
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
          <div
            className={cn("space-y-0", {
              "space-y-3": isCheckout,
            })}
          >
            <Button
              type="button"
              variant="main"
              size="lg"
              className="w-full uppercase"
              disabled={pending || !email.trim()}
              onClick={requestLink}
            >
              continue
            </Button>
            {isCheckout && (
              <>
                <Text variant="uppercase" className="text-center">
                  or
                </Text>
                <Button
                  variant="simpleReverseWithBorder"
                  className="w-full uppercase"
                  size="lg"
                >
                  checkout as guest
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex flex-col items-center gap-16">
            <Text variant="uppercase">enter your verificaiton code</Text>
            <OtpInput
              id="login-code"
              value={code}
              onChange={setCode}
              disabled={pending}
            />
          </div>
          <div className="space-y-5">
            <Button
              type="button"
              variant="main"
              size="lg"
              className="w-full uppercase"
              disabled={pending || code.length !== 6}
              onClick={verifyCode}
            >
              resend code in
            </Button>
            <Text variant="uppercase">
              or sign in via the link sent to your email
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}

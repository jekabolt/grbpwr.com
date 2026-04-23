"use client";

import type { ChangeEvent } from "react";
import { currencySymbols } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import { useAccountLogin } from "../utils/use-account-login";

export function AccountLoginForm({
  isCheckout = false,
  onCheckoutAsGuest,
}: {
  isCheckout?: boolean;
  onCheckoutAsGuest?: () => void;
}) {
  const { currentCountry } = useTranslationsStore((s) => s);
  const {
    email,
    code,
    step,
    pending,
    toastOpen,
    toastMessage,
    resendSeconds,
    isValidEmail,
    setEmail,
    setCode,
    setToastOpen,
    sendInitialCode,
    resendCode,
    verifyCode,
  } = useAccountLogin();

  return (
    <>
      <div className={cn("flex h-full w-full items-center gap-6 lg:max-w-sm")}>
        {step === "email" ? (
          <EmailStep
            email={email}
            pending={pending}
            isValidEmail={isValidEmail}
            isCheckout={isCheckout}
            currentCountryName={currentCountry.name}
            currentCurrencyKey={currentCountry.currencyKey}
            onEmailChange={setEmail}
            onContinue={sendInitialCode}
            onCheckoutAsGuest={onCheckoutAsGuest}
          />
        ) : (
          <CodeStep
            code={code}
            pending={pending}
            resendSeconds={resendSeconds}
            onCodeChange={setCode}
            onCodeComplete={verifyCode}
            onResend={resendCode}
          />
        )}
      </div>
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}

function EmailStep({
  email,
  pending,
  isValidEmail,
  isCheckout,
  currentCountryName,
  currentCurrencyKey,
  onEmailChange,
  onContinue,
  onCheckoutAsGuest,
}: {
  email: string;
  pending: boolean;
  isValidEmail: boolean;
  isCheckout: boolean;
  currentCountryName: string;
  currentCurrencyKey?: string;
  onEmailChange: (value: string) => void;
  onContinue: () => void;
  onCheckoutAsGuest?: () => void;
}) {
  const currencySymbol = currentCurrencyKey
    ? currencySymbols[currentCurrencyKey as keyof typeof currencySymbols]
    : "";

  return (
    <div className="w-full space-y-10">
      <div className="flex flex-col items-center gap-6">
        <Text variant="uppercase">log in or create account</Text>
        <Text variant="uppercase">
          you are in country: {currentCountryName} / {currencySymbol} change
          location
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
            onEmailChange(e.target.value)
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
          disabled={pending || !isValidEmail}
          onClick={onContinue}
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
              type="button"
              onClick={onCheckoutAsGuest}
            >
              checkout as guest
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function CodeStep({
  code,
  pending,
  resendSeconds,
  onCodeChange,
  onCodeComplete,
  onResend,
}: {
  code: string;
  pending: boolean;
  resendSeconds: number;
  onCodeChange: (value: string) => void;
  onCodeComplete: (code: string) => void;
  onResend: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="space-y-16">
        <Text variant="uppercase" className="text-center">
          enter your verification code
        </Text>
        <OtpInput
          id="login-code"
          value={code}
          onChange={onCodeChange}
          onComplete={onCodeComplete}
          disabled={pending}
        />
      </div>
      <div className="w-full space-y-5 text-center lg:w-auto">
        <Button
          type="button"
          variant="main"
          size="lg"
          className="w-full uppercase"
          disabled={pending || resendSeconds > 0}
          onClick={onResend}
        >
          {resendSeconds > 0
            ? `resend code in ${resendSeconds}`
            : "resend code"}
        </Button>
        <Text variant="uppercase">
          or sign in via the link sent to your email
        </Text>
      </div>
    </div>
  );
}

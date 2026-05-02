"use client";

import { useEffect, type ChangeEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import { UserLocationTrigger } from "../_components/user-location";
import { useAccountLogin } from "../utils/use-account-login";
import {
  AccountCartDesktopOrderSummary,
  AccountCartMobileOrderSummary,
} from "./account-cart-mobile-order-summary";

export type AccountLoginStep = "email" | "code";

export function AccountLoginForm({
  isCheckout = false,
  onCheckoutAsGuest,
  onStepChange,
}: {
  isCheckout?: boolean;
  onCheckoutAsGuest?: () => void;
  onStepChange?: (step: AccountLoginStep) => void;
}) {
  const hasCartSummary = useCart((state) =>
    state.products.some((product) => Boolean(product.productData)),
  );
  const {
    email,
    code,
    step,
    pending,
    toastOpen,
    toastMessage,
    resendSeconds,
    storageChecked,
    isValidEmail,
    setEmail,
    setCode,
    setToastOpen,
    sendInitialCode,
    resendCode,
    verifyCode,
  } = useAccountLogin();
  const showCartSummary = hasCartSummary && step === "email";

  useEffect(() => {
    if (!storageChecked) return;
    onStepChange?.(step);
  }, [onStepChange, step, storageChecked]);

  if (!storageChecked) {
    return <div className="h-[340px] w-full lg:max-w-[400px]" aria-hidden />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={cn("flex w-full items-center", {
          "min-h-[340px] justify-center": !showCartSummary,
          "pb-28": showCartSummary,
          "lg:grid lg:max-w-[1000px] lg:grid-cols-2 lg:items-center lg:gap-20":
            showCartSummary,
        })}
      >
        <div className="mx-auto flex h-auto w-full items-center gap-6 lg:max-w-[400px]">
          {step === "email" ? (
            <EmailStep
              email={email}
              pending={pending}
              isValidEmail={isValidEmail}
              isCheckout={isCheckout}
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
        {showCartSummary && (
          <div className="hidden lg:block">
            <AccountCartDesktopOrderSummary />
          </div>
        )}
      </div>
      {showCartSummary && (
        <div className="fixed inset-x-2.5 bottom-6 lg:hidden">
          <AccountCartMobileOrderSummary />
        </div>
      )}
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </div>
  );
}

function EmailStep({
  email,
  pending,
  isValidEmail,
  isCheckout,
  onEmailChange,
  onContinue,
  onCheckoutAsGuest,
}: {
  email: string;
  pending: boolean;
  isValidEmail: boolean;
  isCheckout: boolean;
  onEmailChange: (value: string) => void;
  onContinue: () => void;
  onCheckoutAsGuest?: () => void;
}) {
  const t = useTranslations("account");

  return (
    <div className="w-full space-y-10">
      <div className="flex flex-col items-center gap-6">
        <Text
          variant="uppercase"
          className={cn("", {
            "text-textInactiveColor": pending,
          })}
        >
          {t("login")}
        </Text>
        <UserLocationTrigger
          pending={pending}
          showLabel={false}
          showCurrentCountryText
          buttonLabel={t("change location")}
        />
      </div>
      <div>
        <Text
          variant="uppercase"
          className={cn("", {
            "text-textInactiveColor": pending,
          })}
        >
          {t("email")}
        </Text>
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
          {t("continue")}
        </Button>
        {isCheckout && (
          <>
            <Text variant="uppercase" className="text-center">
              {t("or")}
            </Text>
            <Button
              variant="simpleReverseWithBorder"
              className="w-full uppercase"
              size="lg"
              type="button"
              onClick={onCheckoutAsGuest}
            >
              {t("checkout as guest")}
            </Button>
          </>
        )}
      </div>
      <div>
        <Text variant="inactive" className="text-center uppercase">
          {t.rich("email_consent_notice", {
            privacy: (chunks) => (
              <Link
                href="/legal-notices?section=privacy"
                className="underline hover:no-underline"
              >
                {chunks}
              </Link>
            ),
            membership: (chunks) => (
              <Link
                href="/legal-notices?section=membership"
                className="underline hover:no-underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </Text>
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
  const t = useTranslations("account");

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full flex-col items-center gap-16">
        <Text
          variant="uppercase"
          className={cn("text-center text-textColor", {
            "text-textInactiveColor": pending,
          })}
        >
          {t("enter verification code from your email")}
        </Text>
        <div className="w-full space-y-10">
          <OtpInput
            id="login-code"
            value={code}
            onChange={onCodeChange}
            onComplete={onCodeComplete}
            disabled={pending}
          />
          <div className="space-y-5 text-center">
            <Button
              type="button"
              variant="main"
              size="lg"
              className="w-full uppercase"
              loading={pending}
              disabled={pending || resendSeconds > 0}
              onClick={onResend}
            >
              {resendSeconds > 0
                ? `${t("resend code in")} ${resendSeconds}`
                : `${t("resend code")}`}
            </Button>
            <Text variant="uppercase" className="text-textInactiveColor">
              {t("or continue using the link sent to your email")}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

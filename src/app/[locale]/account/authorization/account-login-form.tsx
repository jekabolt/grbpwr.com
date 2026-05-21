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

const LOGIN_FORM_WIDTH_CLASS = "w-full max-w-md";

export function AccountLoginForm({
  isCheckout = false,
  onCheckoutAsGuest,
  onStepChange,
  onVerified,
}: {
  isCheckout?: boolean;
  onCheckoutAsGuest?: () => void;
  onStepChange?: (step: AccountLoginStep) => void;
  onVerified?: () => void;
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
    codeVerified,
    isValidEmail,
    setEmail,
    setCode,
    setToastOpen,
    sendInitialCode,
    resendCode,
    verifyCode,
  } = useAccountLogin();
  const showCartSummary = hasCartSummary && !isCheckout && step === "email";

  useEffect(() => {
    if (!storageChecked) return;
    onStepChange?.(step);
  }, [onStepChange, step, storageChecked]);

  useEffect(() => {
    if (!codeVerified) return;
    onVerified?.();
  }, [codeVerified, onVerified]);

  if (!storageChecked) {
    return (
      <div className={cn("h-[340px]", LOGIN_FORM_WIDTH_CLASS)} aria-hidden />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={cn("flex h-full w-full items-center", {
          "min-h-[340px] justify-center": !showCartSummary,
          "pb-28": showCartSummary,
          "lg:grid lg:max-w-[1000px] lg:grid-cols-2 lg:items-start lg:gap-20":
            showCartSummary,
        })}
      >
        <div>
          <div
            className={cn(
              "mx-auto flex h-auto items-center gap-6",
              LOGIN_FORM_WIDTH_CLASS,
            )}
          >
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
        </div>
        {showCartSummary && (
          <div className="hidden lg:block">
            <AccountCartDesktopOrderSummary />
          </div>
        )}
      </div>
      {showCartSummary && (
        <div className="fixed inset-x-2.5 bottom-6 top-auto lg:hidden">
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
    <div className={cn("space-y-6", LOGIN_FORM_WIDTH_CLASS)}>
      <div
        className={cn(
          "space-y-10 lg:border lg:border-textInactiveColor lg:p-10",
          {
            "text-textInactiveColor": pending,
          },
        )}
      >
        <div className="flex w-full flex-col items-center gap-6">
          <Text variant="uppercase">{t("login")}</Text>
          <UserLocationTrigger
            pending={pending}
            showLabel={false}
            showCurrentCountryText
            buttonLabel={t("change location")}
          />
        </div>
        <div>
          <Text variant="uppercase">{t("email")}</Text>
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
      </div>
      {isCheckout && (
        <div className="space-y-4">
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
        </div>
      )}
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
    <div
      className={cn(
        "flex items-center justify-center lg:border lg:border-textInactiveColor lg:p-10",
        LOGIN_FORM_WIDTH_CLASS,
      )}
    >
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

"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import {
  AccountDesktopOrderSummarySkeleton,
  AccountMobileOrderSummarySkeleton,
  LoginEmailStepSkeleton,
} from "../_components/account-login-form-skeleton";
import { UserLocationTrigger } from "../_components/user-location";
import { useAccountLogin } from "../utils/use-account-login";
import {
  AccountCartDesktopOrderSummary,
  AccountCartMobileOrderSummary,
} from "./account-cart-mobile-order-summary";

export type AccountLoginStep = "email" | "code";

const LOGIN_FORM_WIDTH_CLASS = "w-full max-w-md";

// The magic-link route handlers redirect back with `?login_error=<code>` for
// this taxonomy. next-intl's `t()` does NOT silently fall back, so an unknown
// (or crafted) value must be coerced to a known key before lookup.
const KNOWN_LOGIN_ERROR_CODES = new Set([
  "expired",
  "used",
  "invalid",
  "unauthorized",
  "rate_limited",
  "backend_unavailable",
  "missing_token",
  "bad_request",
  "invalid_or_expired_link",
]);

export function AccountLoginForm({
  isCheckout = false,
  onCheckoutAsGuest,
  onStepChange,
  onVerified,
  onLoginSuccess,
}: {
  isCheckout?: boolean;
  onCheckoutAsGuest?: () => void;
  onStepChange?: (step: AccountLoginStep) => void;
  onVerified?: () => void;
  onLoginSuccess?: (account: StorefrontAccount) => void;
}) {
  const products = useCart((state) => state.products);
  const revalidateCart = useCart((state) => state.revalidateCart);
  const currency =
    useTranslationsStore((state) => state.currentCountry.currencyKey) || "EUR";
  const t = useTranslations("account");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    email,
    code,
    step,
    pending,
    toastOpen,
    toastMessage,
    toastDuration,
    resendSeconds,
    storageChecked,
    codeVerified,
    codeInvalid,
    verifyErrorNonce,
    isValidEmail,
    setEmail,
    setCode,
    setToastOpen,
    showError,
    sendInitialCode,
    resendCode,
    verifyCode,
    goToEmailStep,
  } = useAccountLogin({ isCheckout, onLoginSuccess });
  const showOrderSummary =
    !isCheckout && step === "email" && products.length > 0;
  const isRestoringSession = !storageChecked;
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  useEffect(() => {
    if (!showOrderSummary) setMobileSummaryOpen(false);
  }, [showOrderSummary]);

  // Surface the magic-link `login_error` taxonomy the route handlers redirect
  // with, then strip the param so it cannot re-fire on refresh. Persistent toast
  // (duration=Infinity) so a cold-landed expired-link error does not vanish.
  useEffect(() => {
    const loginError = searchParams.get("login_error");
    if (!loginError) return;
    const errorCode = KNOWN_LOGIN_ERROR_CODES.has(loginError)
      ? loginError
      : "invalid_or_expired_link";
    showError(t(`login_error.${errorCode}`));
    const params = new URLSearchParams(searchParams);
    params.delete("login_error");
    const remainingQs = params.toString();
    router.replace(pathname + (remainingQs ? `?${remainingQs}` : ""), {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!storageChecked) return;
    onStepChange?.(step);
  }, [onStepChange, step, storageChecked]);

  useEffect(() => {
    if (!codeVerified) return;
    onVerified?.();
  }, [codeVerified, onVerified]);

  useEffect(() => {
    if (isCheckout || products.length === 0) return;
    if (products.every((product) => Boolean(product.productData))) return;
    void revalidateCart(currency);
  }, [currency, isCheckout, products, revalidateCart]);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col text-textColor">
      <div
        className={cn("flex min-h-0 w-full flex-1", {
          "items-center justify-center": !isCheckout,
          "items-start justify-center": isCheckout,
          "lg:justify-center lg:px-32 lg:pt-24": showOrderSummary,
        })}
      >
        <div
          className={cn("flex min-h-0 w-full flex-1", {
            "items-center justify-center": !isCheckout,
            "items-start justify-center": isCheckout,
            "lg:grid lg:h-full lg:grid-cols-2 lg:items-start lg:gap-28":
              showOrderSummary,
            "pb-28 lg:pb-0": showOrderSummary,
          })}
        >
          <div
            className={cn("w-full min-w-0", {
              "flex min-h-0 lg:h-full lg:items-start lg:justify-center":
                showOrderSummary,
            })}
          >
            <div
              className={cn(
                "mx-auto flex h-auto w-full items-center gap-6",
                LOGIN_FORM_WIDTH_CLASS,
              )}
            >
              {isRestoringSession ? (
                <LoginEmailStepSkeleton />
              ) : step === "email" ? (
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
                  codeInvalid={codeInvalid}
                  verifyErrorNonce={verifyErrorNonce}
                  onCodeChange={setCode}
                  onCodeComplete={verifyCode}
                  onResend={resendCode}
                  onChangeEmail={goToEmailStep}
                />
              )}
            </div>
          </div>
          {showOrderSummary && (
            <div className="hidden min-h-0 lg:flex lg:h-full lg:flex-col">
              {isRestoringSession ? (
                <AccountDesktopOrderSummarySkeleton />
              ) : (
                <AccountCartDesktopOrderSummary />
              )}
            </div>
          )}
        </div>
      </div>
      {showOrderSummary && (
        <div
          className={cn(
            "fixed inset-x-2.5 bottom-6 top-2.5 z-40 flex flex-col justify-end lg:hidden",
            !mobileSummaryOpen && "pointer-events-none",
          )}
        >
          {isRestoringSession ? (
            <AccountMobileOrderSummarySkeleton />
          ) : (
            <AccountCartMobileOrderSummary
              onOpenChange={setMobileSummaryOpen}
            />
          )}
        </div>
      )}
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        duration={toastDuration}
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
          <Text variant="uppercase" component="h1">
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
          <Text variant="uppercase" component="label" htmlFor="email">
            {t("email")}
          </Text>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            enterKeyHint="go"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onEmailChange(e.target.value)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && !pending && isValidEmail) {
                e.preventDefault();
                onContinue();
              }
            }}
            disabled={pending}
          />
        </div>
        <Button
          type="button"
          variant="main"
          size="lg"
          className="w-full uppercase"
          loading={pending}
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
        <Text className="text-center uppercase">
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
  codeInvalid,
  verifyErrorNonce,
  onCodeChange,
  onCodeComplete,
  onResend,
  onChangeEmail,
}: {
  code: string;
  pending: boolean;
  resendSeconds: number;
  codeInvalid: boolean;
  verifyErrorNonce: number;
  onCodeChange: (value: string) => void;
  onCodeComplete: (code: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
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
          component="h1"
          id="login-code-label"
          variant="uppercase"
          className={cn("text-center text-textColor", {
            "text-textInactiveColor": pending,
          })}
        >
          {t("enter verification code from your email")}
        </Text>
        <div className="w-full space-y-10">
          <div className="space-y-2.5">
            <OtpInput
              id="login-code"
              value={code}
              onChange={onCodeChange}
              onComplete={onCodeComplete}
              disabled={pending}
              autoFocus
              invalid={codeInvalid}
              errorNonce={verifyErrorNonce}
              labelledById="login-code-label"
              describedById={codeInvalid ? "login-code-error" : undefined}
              getDigitLabel={(index) =>
                t("otp_digit_label", { index: index + 1, length: 6 })
              }
            />
            {codeInvalid && (
              <Text
                id="login-code-error"
                variant="error"
                className="lowercase"
              >
                {t("otp_error")}
              </Text>
            )}
          </div>
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
            <Text variant="uppercase">
              {t("or continue using the link sent to your email")}
            </Text>
            <Button
              type="button"
              variant="underline"
              className="mx-auto w-fit text-center uppercase"
              disabled={pending}
              onClick={onChangeEmail}
            >
              {t("use a different email")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  requestAccountLoginCode,
  verifyAccountLoginCode,
} from "../authorization/api";
import { getErrorMessage } from "@/lib/error-message";
import {
  invalidateAccountSessionCache,
  storefrontAccountToProfile,
} from "@/lib/storefront-account/client-session";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";

const RESEND_TIMEOUT_SECONDS = 60;
const LOGIN_ATTEMPT_STORAGE_KEY = "account-login-attempt";
const LOGIN_CODE_COOLDOWN_KEY = "account-login-code-cooldown";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
type LoginStep = "email" | "code";

type StoredLoginAttempt = {
  email: string;
  step: LoginStep;
  resendAvailableAt?: number;
};

type StoredCodeCooldown = {
  email: string;
  resendAvailableAt: number;
};

function normalizeStoredEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getRemainingResendSeconds(resendAvailableAt?: number): number {
  return Math.max(
    0,
    Math.ceil(((resendAvailableAt ?? 0) - Date.now()) / 1000),
  );
}

function isCooldownActive(resendAvailableAt?: number): boolean {
  return (resendAvailableAt ?? 0) > Date.now();
}

function readStoredLoginAttempt(): StoredLoginAttempt | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredLoginAttempt>;
    const emailRaw =
      typeof parsed.email === "string" ? parsed.email.trim() : "";
    const resendAvailableAt =
      typeof parsed.resendAvailableAt === "number"
        ? parsed.resendAvailableAt
        : undefined;

    if (parsed.step === "email") {
      if (!emailRaw) return null;
      return {
        email: emailRaw,
        step: "email",
        resendAvailableAt,
      };
    }

    if (parsed.step !== "code" || !emailRaw) {
      return null;
    }

    return {
      email: normalizeStoredEmail(emailRaw),
      step: "code",
      resendAvailableAt: resendAvailableAt ?? 0,
    };
  } catch {
    return null;
  }
}

function readCodeCooldown(): StoredCodeCooldown | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(LOGIN_CODE_COOLDOWN_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredCodeCooldown>;
    const email =
      typeof parsed.email === "string" ? normalizeStoredEmail(parsed.email) : "";
    const resendAvailableAt =
      typeof parsed.resendAvailableAt === "number"
        ? parsed.resendAvailableAt
        : 0;

    if (!email || resendAvailableAt <= 0) return null;

    return { email, resendAvailableAt };
  } catch {
    return null;
  }
}

function writeCodeCooldown(email: string, resendAvailableAt?: number): void {
  if (typeof window === "undefined") return;

  const attempt: StoredCodeCooldown = {
    email: normalizeStoredEmail(email),
    resendAvailableAt:
      resendAvailableAt ?? Date.now() + RESEND_TIMEOUT_SECONDS * 1000,
  };

  try {
    sessionStorage.setItem(LOGIN_CODE_COOLDOWN_KEY, JSON.stringify(attempt));
  } catch { }
}

function clearLoginCodeCooldown(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(LOGIN_CODE_COOLDOWN_KEY);
  } catch { }
}

function writeStoredLoginAttempt(
  email: string,
  resendAvailableAt?: number,
  options?: { forceNewCooldown?: boolean },
): void {
  if (typeof window === "undefined") return;

  const normalized = normalizeStoredEmail(email);
  const existingCooldown = readCodeCooldown();
  const hasActiveExisting =
    existingCooldown?.email === normalized &&
    isCooldownActive(existingCooldown.resendAvailableAt);

  let availableAt: number;
  if (resendAvailableAt !== undefined) {
    availableAt = resendAvailableAt;
  } else if (hasActiveExisting && !options?.forceNewCooldown) {
    availableAt = existingCooldown.resendAvailableAt;
  } else {
    availableAt = Date.now() + RESEND_TIMEOUT_SECONDS * 1000;
  }

  const attempt: StoredLoginAttempt = {
    email: normalized,
    step: "code",
    resendAvailableAt: availableAt,
  };

  try {
    sessionStorage.setItem(LOGIN_ATTEMPT_STORAGE_KEY, JSON.stringify(attempt));
    if (options?.forceNewCooldown || !hasActiveExisting) {
      writeCodeCooldown(email, availableAt);
    }
  } catch { }
}

function writeCodeStepMarker(email: string): void {
  if (typeof window === "undefined") return;

  const normalized = normalizeStoredEmail(email);
  const cooldown = readCodeCooldown();
  const resendAvailableAt =
    cooldown?.email === normalized && isCooldownActive(cooldown.resendAvailableAt)
      ? cooldown.resendAvailableAt
      : Date.now() + RESEND_TIMEOUT_SECONDS * 1000;

  try {
    sessionStorage.setItem(
      LOGIN_ATTEMPT_STORAGE_KEY,
      JSON.stringify({
        email: normalized,
        step: "code",
        resendAvailableAt,
      } satisfies StoredLoginAttempt),
    );
  } catch { }
}

export function clearStoredLoginAttempt(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(LOGIN_ATTEMPT_STORAGE_KEY);
  } catch { }
}

export function clearAccountLoginPersistence(): void {
  clearStoredLoginAttempt();
  clearLoginCodeCooldown();
}

function getActiveCooldownForEmail(
  email: string,
): { resendAvailableAt: number; remaining: number } | null {
  const normalized = normalizeStoredEmail(email);
  const cooldown = readCodeCooldown();
  if (
    !cooldown ||
    cooldown.email !== normalized ||
    !isCooldownActive(cooldown.resendAvailableAt)
  ) {
    return null;
  }

  return {
    resendAvailableAt: cooldown.resendAvailableAt,
    remaining: getRemainingResendSeconds(cooldown.resendAvailableAt),
  };
}

type UseAccountLoginOptions = {
  /** Checkout already has the account client-side; skip RSC refresh. */
  isCheckout?: boolean;
  onLoginSuccess?: (account: StorefrontAccount) => void;
};

export function useAccountLogin(options: UseAccountLoginOptions = {}) {
  const { isCheckout = false, onLoginSuccess } = options;
  const router = useRouter();
  const t = useTranslations("account");
  const setSignedIn = useAccountOnboardingStore((s) => s.setSignedIn);
  const setAccount = useAccountOnboardingStore((s) => s.setAccount);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<LoginStep>("email");
  const [pending, setPending] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastDuration, setToastDuration] = useState<number | undefined>(
    undefined,
  );
  const [resendSeconds, setResendSeconds] = useState(0);
  const [storageChecked, setStorageChecked] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [verifyErrorNonce, setVerifyErrorNonce] = useState(0);
  const requestInFlightRef = useRef(false);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const isValidCode = /^\d{6}$/.test(normalizedCode);

  const openErrorToast = (message: string, duration?: number) => {
    setToastDuration(duration);
    setToastMessage(message);
    setToastOpen(true);
  };

  // Persistent error surface for the magic-link `login_error` taxonomy: stays
  // until the user dismisses it (`duration={Infinity}`), unlike the ephemeral
  // validation toasts above.
  const showError = (message: string) => {
    openErrorToast(message, Infinity);
  };

  useIsomorphicLayoutEffect(() => {
    const stored = readStoredLoginAttempt();
    if (stored?.step === "code") {
      setEmail(stored.email);
      setStep("code");
      const cooldownRemaining = getActiveCooldownForEmail(stored.email);
      setResendSeconds(
        cooldownRemaining?.remaining ??
          getRemainingResendSeconds(stored.resendAvailableAt),
      );
    }
    setStorageChecked(true);
  }, []);

  useEffect(() => {
    if (step !== "code" || resendSeconds <= 0) return;
    const timeoutId = window.setTimeout(() => {
      setResendSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [resendSeconds, step]);

  // Wrapped setter handed to the code step: typing dismisses the invalid state
  // so the red borders and inline error clear as the user re-enters the code.
  function changeCode(value: string) {
    setCode(value);
    if (codeInvalid) setCodeInvalid(false);
  }

  function updateEmail(value: string) {
    const previousEmail = normalizedEmail;
    setEmail(value);
    setCode("");
    setCodeVerified(false);
    setCodeInvalid(false);
    const nextNormalized = value.trim().toLowerCase();
    const emailChanged = nextNormalized !== previousEmail;
    if (step === "code") {
      setStep("email");
      if (emailChanged) {
        setResendSeconds(0);
        if (!nextNormalized) {
          clearLoginCodeCooldown();
        } else {
          const cooldown = readCodeCooldown();
          if (
            cooldown &&
            normalizeStoredEmail(cooldown.email) !== nextNormalized
          ) {
            clearLoginCodeCooldown();
          }
        }
      }
    }
  }

  async function sendLoginCode(moveToCodeStep: boolean) {
    if (pending || requestInFlightRef.current) return false;
    const activeCooldown = getActiveCooldownForEmail(normalizedEmail);
    if (!moveToCodeStep && activeCooldown) return false;
    if (!isValidEmail) {
      openErrorToast(t("invalid email"));
      return false;
    }

    setCodeVerified(false);

    if (moveToCodeStep && activeCooldown) {
      setStep("code");
      setResendSeconds(activeCooldown.remaining);
      writeCodeStepMarker(normalizedEmail);
      return true;
    }

    requestInFlightRef.current = true;
    setPending(true);

    if (!moveToCodeStep) {
      writeStoredLoginAttempt(normalizedEmail, undefined, {
        forceNewCooldown: true,
      });
      setResendSeconds(RESEND_TIMEOUT_SECONDS);
    }

    try {
      const result = await requestAccountLoginCode(
        normalizedEmail,
        t("failed to request login code"),
      );
      if (!result.ok) {
        openErrorToast(result.error ?? t("failed to request login code"));
        return false;
      }

      if (moveToCodeStep) {
        setStep("code");
        writeStoredLoginAttempt(normalizedEmail, undefined, {
          forceNewCooldown: true,
        });
        setResendSeconds(RESEND_TIMEOUT_SECONDS);
      }
      return true;
    } finally {
      requestInFlightRef.current = false;
      setPending(false);
    }
  }

  async function sendInitialCode() {
    await sendLoginCode(true);
  }

  // Go back to the email step from the code step so the user can enter a
  // different email. The per-email cooldown is intentionally left intact: if
  // they re-enter the same address, sendLoginCode reuses the existing timer
  // instead of sending another email.
  function goToEmailStep() {
    if (pending) return;
    setCode("");
    setCodeVerified(false);
    setCodeInvalid(false);
    setStep("email");
    clearStoredLoginAttempt();
  }

  async function resendCode() {
    await sendLoginCode(false);
  }

  async function verifyCode(codeOverride?: string) {
    if (pending) return;
    const candidateCode = (codeOverride ?? code).trim();
    const isCandidateCodeValid = /^\d{6}$/.test(candidateCode);
    if (!isValidEmail) {
      openErrorToast(t("invalid email"));
      return;
    }
    if (!isCandidateCodeValid) {
      openErrorToast(t("invalid verification code"));
      return;
    }

    setCodeVerified(false);
    setPending(true);
    let verificationSucceeded = false;
    try {
      const result = await verifyAccountLoginCode(
        normalizedEmail,
        candidateCode,
        t("the code couldn’t be verified"),
      );
      if (!result.ok) {
        const errorMessage = result.error ?? t("the code couldn’t be verified");
        // Raw setter so the clear does not reset codeInvalid; keep the red
        // borders and refocus box 0 while surfacing the inline error.
        setCode("");
        setCodeInvalid(true);
        setVerifyErrorNonce((n) => n + 1);
        openErrorToast(errorMessage);
        return;
      }
      if (result.account) {
        invalidateAccountSessionCache();
        setSignedIn(true);
        setAccount(storefrontAccountToProfile(result.account));
        onLoginSuccess?.(result.account);
      }
      setCodeVerified(true);
      clearAccountLoginPersistence();
      if (!isCheckout) {
        router.refresh();
      }
      verificationSucceeded = true;
    } catch (error) {
      openErrorToast(
        getErrorMessage(error, t("the code couldn’t be verified")),
      );
      setCode("");
      setCodeInvalid(true);
      setVerifyErrorNonce((n) => n + 1);
    } finally {
      setPending(false);
    }
  }

  return {
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
    isValidCode,
    setEmail: updateEmail,
    setCode: changeCode,
    setToastOpen,
    showError,
    sendInitialCode,
    resendCode,
    verifyCode,
    goToEmailStep,
  };
}

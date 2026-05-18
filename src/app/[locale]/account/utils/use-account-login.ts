import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  requestAccountLoginCode,
  verifyAccountLoginCode,
} from "../authorization/api";

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

type InitialLoginState = {
  email: string;
  step: LoginStep;
  resendSeconds: number;
  storageChecked: boolean;
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

function getInitialLoginState(): InitialLoginState {
  if (typeof window === "undefined") {
    return {
      email: "",
      step: "email",
      resendSeconds: 0,
      storageChecked: false,
    };
  }

  const stored = readStoredLoginAttempt();
  if (!stored) {
    return {
      email: "",
      step: "email",
      resendSeconds: 0,
      storageChecked: true,
    };
  }

  if (stored.step === "email") {
    return {
      email: "",
      step: "email",
      resendSeconds: 0,
      storageChecked: true,
    };
  }

  return {
    email: stored.email,
    step: "code",
    resendSeconds: getRemainingResendSeconds(stored.resendAvailableAt),
    storageChecked: true,
  };
}

export function useAccountLogin() {
  const router = useRouter();
  const t = useTranslations("account");
  const [initialState] = useState(getInitialLoginState);
  const [email, setEmail] = useState(initialState.email);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<LoginStep>(initialState.step);
  const [pending, setPending] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(initialState.resendSeconds);
  const [storageChecked, setStorageChecked] = useState(initialState.storageChecked);
  const [codeVerified, setCodeVerified] = useState(false);
  const requestInFlightRef = useRef(false);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const isValidCode = /^\d{6}$/.test(normalizedCode);

  const openErrorToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  useIsomorphicLayoutEffect(() => {
    if (storageChecked) return;
    const stored = readStoredLoginAttempt();
    if (!stored) {
      setStorageChecked(true);
      return;
    }

    if (stored.step === "code") {
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

  function updateEmail(value: string) {
    const previousEmail = normalizedEmail;
    setEmail(value);
    setCode("");
    setCodeVerified(false);
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
        if (errorMessage) {
          setCode("");
        }
        openErrorToast(errorMessage);
        return;
      }
      setCodeVerified(true);
      clearAccountLoginPersistence();
      router.refresh();
      verificationSucceeded = true;
    } catch (error) {
      openErrorToast(t("the code couldn’t be verified"));
      setCode("");
    } finally {
      if (!verificationSucceeded) {
        setPending(false);
      }
    }
  }

  return {
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
    isValidCode,
    setEmail: updateEmail,
    setCode,
    setToastOpen,
    sendInitialCode,
    resendCode,
    verifyCode,
  };
}

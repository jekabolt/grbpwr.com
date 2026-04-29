import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  requestAccountLoginCode,
  verifyAccountLoginCode,
} from "../authorization/api";

const RESEND_TIMEOUT_SECONDS = 60;
const LOGIN_ATTEMPT_STORAGE_KEY = "account-login-attempt";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
type LoginStep = "email" | "code";

type StoredLoginAttempt = {
  email: string;
  step: LoginStep;
  resendAvailableAt: number;
};

type InitialLoginState = {
  email: string;
  step: LoginStep;
  resendSeconds: number;
  storageChecked: boolean;
};

function readStoredLoginAttempt(): StoredLoginAttempt | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredLoginAttempt>;
    if (
      parsed.step !== "code" ||
      typeof parsed.email !== "string" ||
      !parsed.email.trim()
    ) {
      return null;
    }

    return {
      email: parsed.email.trim().toLowerCase(),
      step: "code",
      resendAvailableAt:
        typeof parsed.resendAvailableAt === "number"
          ? parsed.resendAvailableAt
          : 0,
    };
  } catch {
    return null;
  }
}

function writeStoredLoginAttempt(email: string): void {
  if (typeof window === "undefined") return;

  const attempt: StoredLoginAttempt = {
    email,
    step: "code",
    resendAvailableAt: Date.now() + RESEND_TIMEOUT_SECONDS * 1000,
  };

  try {
    sessionStorage.setItem(LOGIN_ATTEMPT_STORAGE_KEY, JSON.stringify(attempt));
  } catch { }
}

function clearStoredLoginAttempt(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(LOGIN_ATTEMPT_STORAGE_KEY);
  } catch { }
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

  return {
    email: stored.email,
    step: stored.step,
    resendSeconds: Math.max(
      0,
      Math.ceil((stored.resendAvailableAt - Date.now()) / 1000),
    ),
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

    setEmail(stored.email);
    setStep(stored.step);
    setResendSeconds(
      Math.max(0, Math.ceil((stored.resendAvailableAt - Date.now()) / 1000)),
    );
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
    setEmail(value);
    setCode("");
    setCodeVerified(false);
    if (step === "code") {
      setStep("email");
      setResendSeconds(0);
    }
    clearStoredLoginAttempt();
  }

  async function sendLoginCode(moveToCodeStep: boolean) {
    if (pending || requestInFlightRef.current) return false;
    if (!moveToCodeStep && resendSeconds > 0) return false;
    if (!isValidEmail) {
      openErrorToast("invalid email");
      return false;
    }

    setCodeVerified(false);
    requestInFlightRef.current = true;
    setPending(true);
    try {
      const result = await requestAccountLoginCode(normalizedEmail);
      if (!result.ok) {
        openErrorToast(result.error ?? "failed to request login code");
        return false;
      }

      if (moveToCodeStep) {
        setStep("code");
      }
      writeStoredLoginAttempt(normalizedEmail);
      setResendSeconds(RESEND_TIMEOUT_SECONDS);
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
      openErrorToast("invalid email");
      return;
    }
    if (!isCandidateCodeValid) {
      openErrorToast("invalid verification code");
      return;
    }

    setCodeVerified(false);
    setPending(true);
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
      clearStoredLoginAttempt();
      router.refresh();
    } catch (error) {
      openErrorToast(t("the code couldn’t be verified"));
      setCode("");
      return;
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

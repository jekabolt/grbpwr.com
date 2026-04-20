import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { requestAccountLoginCode, verifyAccountLoginCode } from "../authorization/api";

const RESEND_TIMEOUT_SECONDS = 30;
type LoginStep = "email" | "code";

export function useAccountLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState<LoginStep>("email");
    const [pending, setPending] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [resendSeconds, setResendSeconds] = useState(0);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    const isValidCode = /^\d{6}$/.test(normalizedCode);

    const openErrorToast = (message: string) => {
        setToastMessage(message);
        setToastOpen(true);
    };

    useEffect(() => {
        if (step !== "code" || resendSeconds <= 0) return;
        const timeoutId = window.setTimeout(() => {
            setResendSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => window.clearTimeout(timeoutId);
    }, [resendSeconds, step]);

    async function sendLoginCode(moveToCodeStep: boolean) {
        if (!isValidEmail) {
            openErrorToast("invalid email");
            return false;
        }

        setPending(true);
        try {
            const result = await requestAccountLoginCode(normalizedEmail);
            if (!result.ok) {
                openErrorToast(result.error ?? "failed to request login code");
                return false;
            }

            if (moveToCodeStep) setStep("code");
            setResendSeconds(RESEND_TIMEOUT_SECONDS);
            return true;
        } finally {
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

        setPending(true);
        try {
            const result = await verifyAccountLoginCode(normalizedEmail, candidateCode);
            if (!result.ok) {
                openErrorToast(result.error ?? "failed to verify code");
                return;
            }
            router.refresh();
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
        isValidEmail,
        isValidCode,
        setEmail,
        setCode,
        setToastOpen,
        sendInitialCode,
        resendCode,
        verifyCode,
    };
}
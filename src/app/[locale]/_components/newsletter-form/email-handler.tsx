import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { cn, validateEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/form/fields/input-field";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

export const FIELD_PULSE_MS = 500;

export function EmailHandler({
  inactiveBgColor = false,
  emailValue,
  handleEmail,
}: {
  inactiveBgColor?: boolean;
  emailValue: string;
  handleEmail: (email: string) => void;
}) {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [pulseEmail, setPulseEmail] = useState(false);
  const [mobileEmailExpanded, setMobileEmailExpanded] = useState(false);
  const blurTimeoutRef = useRef<number | null>(null);

  const t = useTranslations("newslatter");
  const tToaster = useTranslations("toaster");

  useEffect(() => {
    if (emailValue.trim()) setMobileEmailExpanded(true);
  }, [emailValue]);

  useEffect(() => {
    if (emailValue) setPulseEmail(false);
  }, [emailValue]);

  useEffect(() => {
    if (!pulseEmail) return;
    const id = window.setTimeout(() => setPulseEmail(false), FIELD_PULSE_MS);
    return () => window.clearTimeout(id);
  }, [pulseEmail]);

  useEffect(
    () => () => {
      if (blurTimeoutRef.current !== null) {
        window.clearTimeout(blurTimeoutRef.current);
      }
    },
    [],
  );

  const handleEmailFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (blurTimeoutRef.current !== null) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setMobileEmailExpanded(true);
    if (!inactiveBgColor) {
      requestAnimationFrame(() => {
        event.target.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }
  };

  const handleEmailBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (blurTimeoutRef.current !== null) {
      window.clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = window.setTimeout(() => {
      const hasValue = Boolean(
        event.target.value.trim() || emailValue.trim(),
      );
      if (!hasValue) setMobileEmailExpanded(false);
      blurTimeoutRef.current = null;
    }, 200);
  };

  const saveEmail = (email: string) => {
    const emailValue = (email ?? "").trim();
    if (!emailValue) {
      setPulseEmail(true);
      setToastMessage(tToaster("email_required"));
      setToastOpen(true);
      return;
    }
    if (!validateEmail(emailValue)) {
      setPulseEmail(true);
      setToastMessage(tToaster("invalid_email"));
      setToastOpen(true);
      return;
    }
    handleEmail(emailValue);
  };

  return (
    <div
      className={cn("flex w-full flex-col items-start gap-6 lg:bg-bgColor", {
        "bg-textInactiveColorAlpha p-2.5": inactiveBgColor,
      })}
    >
      <Text variant="uppercase" className="leading-none">
        {t("mailing list")}
      </Text>
      <div className="flex w-full flex-col space-y-3">
        <div className="relative">
          {pulseEmail && <Overlay color="highlight" cover="container" />}
          <InputField
            name="email"
            type="email"
            placeholder={t("email")}
            className={cn("", {
              "bg-transparent": inactiveBgColor,
            })}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
          />
        </div>
        {mobileEmailExpanded && (
          <Text variant="uppercase" className="leading-none lg:hidden">
            {t.rich("consent_notice", {
              privacy: (chunks) => (
                <Link
                  href="/legal-notices?section=privacy"
                  className="underline hover:no-underline"
                >
                  {chunks}
                </Link>
              ),
              terms: (chunks) => (
                <Link
                  href="/legal-notices?section=terms"
                  className="underline hover:no-underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </Text>
        )}
        <Text variant="uppercase" className="hidden leading-none lg:block">
          {t.rich("consent_notice", {
            privacy: (chunks) => (
              <Link
                href="/legal-notices?section=privacy"
                className="underline hover:no-underline"
              >
                {chunks}
              </Link>
            ),
            terms: (chunks) => (
              <Link
                href="/legal-notices?section=terms"
                className="underline hover:no-underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </Text>
      </div>
      {mobileEmailExpanded && (
        <Button
          variant="simple"
          size="lg"
          type="button"
          onClick={() => saveEmail(emailValue)}
          className={cn("uppercase lg:hidden", {
            "border border-textColor !bg-bgColor !text-textColor": !emailValue,
            "!bg-transparent": inactiveBgColor,
          })}
        >
          {t("subscribe")}
        </Button>
      )}
      <Button
        variant="simple"
        size="lg"
        type="button"
        onClick={() => saveEmail(emailValue)}
        className={cn("hidden uppercase lg:inline-flex", {
          "border border-textColor !bg-transparent !text-textColor lg:!bg-bgColor":
            !emailValue,
        })}
      >
        {t("subscribe")}
      </Button>
      <SubmissionToaster
        open={toastOpen}
        onOpenChange={setToastOpen}
        message={toastMessage}
      />
    </div>
  );
}

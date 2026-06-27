"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { sendFormEvent } from "@/lib/analitycs/form";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import { unsubscribeAction } from "../actions";

interface Props {
  email: string;
}

export function UnsubscribeForm({ email }: Props) {
  const t = useTranslations("unsubscribe");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation when the unsubscribe succeeds so keyboard
  // focus doesn't drop to <body> as the focused button unmounts (WCAG 2.4.3).
  // Programmatic focus() doesn't trigger :focus-visible, so no ring paints here.
  useEffect(() => {
    if (done) {
      confirmationRef.current?.focus();
    }
  }, [done]);

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    const result = await unsubscribeAction(email);
    setIsLoading(false);

    if (result.success) {
      sendFormEvent({
        email,
        formId: "unsubscribe",
      });
      setDone(true);
      return;
    }

    // Never surface the raw server error — always the localized copy.
    setToastOpen(true);
  };

  if (done) {
    return (
      <div
        ref={confirmationRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="flex flex-col items-center gap-6"
      >
        <Text variant="uppercase">{t("success")}</Text>
        <Button
          size="lg"
          variant="simpleReverseWithBorder"
          className="uppercase"
          asChild
        >
          <Link href="/catalog">{t("explore")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* The <h1> deliberately carries the full instructional sentence; no new
          all-locale copy is invented to split it into a separate heading. */}
      <Text component="h1" className="w-full px-5 text-center lg:w-[400px]">
        {t("title")}
      </Text>
      <Button
        size="lg"
        variant="main"
        // flex (overriding the base `block`) keeps the label/Loader centered while
        // min-h-11 raises the touch target to >=44px; the disabled:!* overrides keep
        // the active ink fill during loading so the reverse paper Loader stays visible.
        className="flex min-h-11 items-center justify-center uppercase disabled:!bg-textColor disabled:!border-textColor disabled:!text-bgColor"
        onClick={handleUnsubscribe}
        loading={isLoading}
        disabled={isLoading}
      >
        {t("unsubscribe")}
      </Button>
      <SubmissionToaster
        open={toastOpen}
        message={t("error")}
        onOpenChange={setToastOpen}
        intent="error"
      />
    </>
  );
}

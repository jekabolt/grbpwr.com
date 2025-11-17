"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { sendFormEvent } from "@/lib/analitycs/form";
import { Button } from "@/components/ui/button";
import { SubmissionToaster } from "@/components/ui/toaster";

import { unsubscribeAction } from "../actions";

interface Props {
  email: string;
}

export function UnsubscribeForm({ email }: Props) {
  const t = useTranslations("unsubscribe");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    const result = await unsubscribeAction(email);
    setIsLoading(false);
    setToastMessage(result.success ? t("success") : t("error"));
    setToastOpen(true);

    if (result.success) {
      sendFormEvent({
        email,
        formId: "unsubscribe",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <>
      <Button
        size="lg"
        variant="main"
        className="uppercase"
        onClick={handleUnsubscribe}
        disabled={isLoading}
      >
        {t("unsubscribe")}
      </Button>
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}

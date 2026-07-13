"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, type UseFormReturn } from "react-hook-form";

import { sendNewsletterSignupEvent } from "@/lib/analitycs/form";
import { pushUserIdToDataLayer } from "@/lib/analitycs/utils";
import { serviceClient } from "@/lib/api";
import { isInvalidInputError, isRateLimitError } from "@/lib/error-message";
import { syncSignedInEmailToForm } from "@/lib/stores/account-onboarding/selectors";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { Form } from "@/components/ui/form";
import { SubmissionToaster } from "@/components/ui/toaster";

import { EmailHandler } from "./email-handler";
import { NewsletterPopup } from "./newsletter-popup";
import {
  newsletterDefaultValues,
  newsletterFormSchema,
  type NewsletterFormInput,
  type NewsletterFormValues,
} from "./schema";

export default function NewslatterForm({
  inactiveBgColor = false,
}: {
  inactiveBgColor?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const tToaster = useTranslations("toaster");

  const signedInEmail = useAccountOnboardingStore((s) =>
    s.isSignedIn ? s.account?.email?.trim() || undefined : undefined,
  );
  const form = useForm<NewsletterFormInput, unknown, NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { ...newsletterDefaultValues, email: signedInEmail ?? "" },
    mode: "onSubmit",
  });

  useEffect(
    () =>
      syncSignedInEmailToForm(
        form as unknown as UseFormReturn<NewsletterFormInput>,
        signedInEmail,
      ),
    [form, signedInEmail],
  );

  const emailValue = form.watch("email");

  const handleEmail = (email: string) => {
    form.setValue("email", email);
    setPopupOpen(true);
  };

  async function onSubmit(data: NewsletterFormValues) {
    setIsLoading(true);
    try {
      await serviceClient.SubscribeNewsletter(data);
      await pushUserIdToDataLayer(data.email ?? "");
      sendNewsletterSignupEvent({
        signup_location: "footer",
        page_path:
          typeof window !== "undefined" ? window.location.pathname : "",
      });
      form.reset(newsletterDefaultValues);
      setPopupOpen(false);
      setToastMessage(tToaster("successfully_subscribed"));
      setToastOpen(true);
    } catch (error) {
      console.error("Failed to subscribe to newsletter:", error);
      const message = isRateLimitError(error)
        ? tToaster("too_many_requests")
        : isInvalidInputError(error)
          ? tToaster("invalid_email")
          : tToaster("failed_to_subscribe");
      setToastMessage(message);
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div data-nosnippet>
      <Form {...form}>
        <EmailHandler
          inactiveBgColor={inactiveBgColor}
          emailValue={emailValue ?? ""}
          handleEmail={handleEmail}
        />
        <NewsletterPopup
          open={popupOpen}
          onOpenChange={setPopupOpen}
          isLoading={isLoading}
          onSubscribe={() => form.handleSubmit(onSubmit)()}
        />
      </Form>
      <SubmissionToaster
        open={toastOpen}
        onOpenChange={setToastOpen}
        message={toastMessage}
      />
    </div>
  );
}

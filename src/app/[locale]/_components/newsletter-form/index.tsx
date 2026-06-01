"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  sendGenerateLeadEvent,
  sendNewsletterSignupEvent,
} from "@/lib/analitycs/form";
import { pushUserIdToDataLayer } from "@/lib/analitycs/utils";
import { serviceClient } from "@/lib/api";
import { syncSignedInEmailToForm } from "@/lib/stores/account-onboarding/selectors";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Form } from "@/components/ui/form";
import { SubmissionToaster } from "@/components/ui/toaster";

import { EmailHandler } from "./email-handler";
import { NewsletterPopup } from "./newsletter-popup";
import { newsletterDefaultValues, type NewsletterFormValues } from "./schema";

export default function NewslatterForm({
  inactiveBgColor = false,
}: {
  inactiveBgColor?: boolean;
}) {
  const { currentCountry } = useTranslationsStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const tToaster = useTranslations("toaster");

  const signedInEmail = useAccountOnboardingStore((s) =>
    s.isSignedIn ? s.account?.email?.trim() || undefined : undefined,
  );
  const form = useForm<NewsletterFormValues>({
    defaultValues: { ...newsletterDefaultValues, email: signedInEmail ?? "" },
    mode: "onSubmit",
  });

  useEffect(() => syncSignedInEmailToForm(form, signedInEmail), [form, signedInEmail]);

  const emailValue = form.watch("email");

  const handleEmail = (email: string) => {
    form.setValue("email", email);
    setPopupOpen(true);
  };

  async function onSubmit(data: NewsletterFormValues) {
    const email = (data.email ?? "").trim();
    setIsLoading(true);
    try {
      await serviceClient.SubscribeNewsletter({ email });
      await pushUserIdToDataLayer(email);
      sendGenerateLeadEvent({
        currency: currentCountry.currencyKey || "EUR",
        value: 0,
        lead_source: "newsletter_footer",
      });
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
      const message =
        error instanceof Error && error.message
          ? error.message
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

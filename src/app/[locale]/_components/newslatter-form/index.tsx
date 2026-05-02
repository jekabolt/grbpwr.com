"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  sendGenerateLeadEvent,
  sendNewsletterSignupEvent,
} from "@/lib/analitycs/form";
import { pushUserIdToDataLayer } from "@/lib/analitycs/utils";
import { serviceClient } from "@/lib/api";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn, validateEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/components/ui/form/fields/input-field";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import { newsletterDefaultValues, type NewsletterFormValues } from "./schema";

const FIELD_PULSE_MS = 500;

export default function NewslatterForm({
  inactiveBgColor = false,
}: {
  inactiveBgColor?: boolean;
}) {
  const { currentCountry } = useTranslationsStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [pulseEmail, setPulseEmail] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const t = useTranslations("newslatter");
  const tToaster = useTranslations("toaster");

  const form = useForm<NewsletterFormValues>({
    defaultValues: newsletterDefaultValues,
    mode: "onSubmit",
  });

  const emailValue = form.watch("email");

  useEffect(() => {
    if (emailValue) setPulseEmail(false);
  }, [emailValue]);

  useEffect(() => {
    if (!pulseEmail) return;
    const id = window.setTimeout(() => setPulseEmail(false), FIELD_PULSE_MS);
    return () => window.clearTimeout(id);
  }, [pulseEmail]);

  async function onSubmit(data: NewsletterFormValues) {
    const email = (data.email ?? "").trim();

    if (!email) {
      setPulseEmail(true);
      setToastMessage(tToaster("email_required"));
      setToastOpen(true);
      return;
    }
    if (!validateEmail(email)) {
      setPulseEmail(true);
      setToastMessage(tToaster("invalid_email"));
      setToastOpen(true);
      return;
    }

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "flex w-full flex-col items-start gap-6 lg:bg-bgColor",
            {
              "bg-textInactiveColorAlpha p-2.5": inactiveBgColor,
            },
          )}
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
                disabled={isLoading}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </div>
            {isEmailFocused && (
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
          {isEmailFocused && (
            <Button
              variant="simple"
              size="lg"
              type="submit"
              disabled={isLoading}
              className={cn("uppercase lg:hidden", {
                "border border-textColor !bg-bgColor !text-textColor":
                  !emailValue,
                "!bg-transparent": inactiveBgColor,
              })}
            >
              {t("subscribe")}
            </Button>
          )}
          <Button
            variant="simple"
            size="lg"
            type="submit"
            disabled={isLoading}
            className={cn("hidden uppercase lg:inline-flex", {
              "border border-textColor !bg-transparent !text-textColor lg:!bg-bgColor":
                !emailValue,
            })}
          >
            {t("subscribe")}
          </Button>
        </form>
      </Form>
      <SubmissionToaster
        open={toastOpen}
        onOpenChange={setToastOpen}
        message={toastMessage}
      />
    </div>
  );
}

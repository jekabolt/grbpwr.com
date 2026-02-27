"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
  sendGenerateLeadEvent,
  sendNewsletterSignupEvent,
} from "@/lib/analitycs/form";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import InputField from "@/components/ui/form/fields/input-field";

import FieldsGroupContainer from "./fields-group-container";

export default function ContactFieldsGroup({
  loading,
  isOpen,
  disabled = false,
  onToggle,
}: {
  loading: boolean;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const { watch } = useFormContext();
  const email = watch("email");
  const subscribe = watch("subscribe");
  const prevSubscribeRef = useRef<boolean>(false);
  const t = useTranslations("checkout");

  useEffect(() => {
    if (subscribe && !prevSubscribeRef.current && email) {
      sendGenerateLeadEvent({
        currency: "EUR",
        value: 0,
        lead_source: "newsletter_checkout",
      });
      sendNewsletterSignupEvent({
        signup_location: "checkout",
        page_path:
          typeof window !== "undefined" ? window.location.pathname : "",
      });
    }
    prevSubscribeRef.current = subscribe;
  }, [subscribe, email]);

  return (
    <FieldsGroupContainer
      stage="1/3"
      title={t("contact")}
      isOpen={isOpen}
      onToggle={onToggle}
      disabled={disabled}
    >
      <InputField
        loading={loading}
        variant="secondary"
        name="email"
        label={t("email address:")}
        type="email"
        disabled={disabled}
      />
      <div className="space-y-4" data-nosnippet>
        <CheckboxField
          name="subscribe"
          label={t("accept")}
          disabled={disabled}
        />
        <CheckboxField
          name="termsOfService"
          label={
            <>
              *{t("proceed")}{" "}
              <Link
                href="/legal-notices?section=terms"
                className="underline hover:no-underline"
              >
                {t("terms and conditions")}
              </Link>{" "}
              {t("and").toLocaleUpperCase()}{" "}
              <Link
                href="/legal-notices?section=privacy"
                className="underline hover:no-underline"
              >
                {t("privacy information notice")}
              </Link>
            </>
          }
          disabled={disabled}
        />
      </div>
    </FieldsGroupContainer>
  );
}

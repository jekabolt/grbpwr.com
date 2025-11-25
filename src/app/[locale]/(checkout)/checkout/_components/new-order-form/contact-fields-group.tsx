"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { sendFormEvent } from "@/lib/analitycs/form";
import CheckboxField from "@/components/ui/form/fields/checkbox-field";
import InputField from "@/components/ui/form/fields/input-field";

import FieldsGroupContainer from "./fields-group-container";

export default function ContactFieldsGroup({
  loading,
  isOpen,
  onToggle,
  disabled = false,
}: {
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const { watch } = useFormContext();
  const email = watch("email");
  const subscribe = watch("subscribe");
  const prevSubscribeRef = useRef<boolean>(false);
  const t = useTranslations("checkout");

  useEffect(() => {
    if (subscribe && !prevSubscribeRef.current && email) {
      sendFormEvent({
        email,
        formId: "checkout_subscribe",
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
      <div className="space-y-4">
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

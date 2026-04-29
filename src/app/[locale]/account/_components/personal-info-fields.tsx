"use client";

import { keyboardRestrictions } from "@/constants";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { FormPhoneField } from "@/components/ui/form/fields/form-phone-field";
import InputField from "@/components/ui/form/fields/input-field";

type Props = {
  disabled?: boolean;
  selectedCountryCode?: string;
  /** Two-column grid (e.g. account session); registration flow stays a single column. */
  twoColumn?: boolean;
  className?: string;
};

export function AccountPersonalInfoFields({
  disabled,
  selectedCountryCode,
  twoColumn = false,
  className,
}: Props) {
  const t = useTranslations("checkout");

  return (
    <div
      className={cn(
        twoColumn
          ? "grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start"
          : "flex flex-col gap-6",
        className,
      )}
    >
      <InputField
        name="firstName"
        label={t("first name")}
        variant="secondary"
        keyboardRestriction={keyboardRestrictions.nameFields}
        disabled={disabled}
      />
      <InputField
        name="lastName"
        label={t("last name")}
        variant="secondary"
        keyboardRestriction={keyboardRestrictions.nameFields}
        disabled={disabled}
      />
      <FormPhoneField
        name="phone"
        label={`${t("phone number:")}`}
        selectedCountry={selectedCountryCode}
        disabled={disabled}
        optional
      />
      <InputField
        name="birthDate"
        label="date of birth"
        type="date"
        variant="secondary"
        disabled={disabled}
        optional
      />
    </div>
  );
}

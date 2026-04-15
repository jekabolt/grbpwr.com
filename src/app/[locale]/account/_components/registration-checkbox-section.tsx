"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import CheckboxGlobal from "@/components/ui/checkbox";
import { AccountEmailPreferencesFields } from "@/app/[locale]/account/_components/email-preferences-fields";
import type { AccountSchema } from "@/app/[locale]/account/utils/shema";

type Props = {
  form: UseFormReturn<AccountSchema>;
  disabled?: boolean;
};

export function AccountRegistrationCheckboxSection({ form, disabled }: Props) {
  const tAccount = useTranslations("account");

  return (
    <div className="flex flex-col gap-6">
      <AccountEmailPreferencesFields form={form} disabled={disabled} />
      <CheckboxGlobal
        name="privacyPolicy"
        label={tAccount.rich("privacy policy", {
          privacy: (chunks) => (
            <Link
              className="underline hover:no-underline"
              href="/privacy-policy"
            >
              {chunks}
            </Link>
          ),
          membership: (chunks) => (
            <Link
              className="underline hover:no-underline"
              href="/membership-policy"
            >
              {chunks}
            </Link>
          ),
        })}
      />
    </div>
  );
}

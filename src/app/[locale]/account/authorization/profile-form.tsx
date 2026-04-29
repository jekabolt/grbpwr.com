"use client";

import { useMemo, useState } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";
import { AccountPersonalInfoFields } from "@/app/[locale]/account/_components/personal-info-fields";
import { AccountRegistrationCheckboxSection } from "@/app/[locale]/account/_components/registration-checkbox-section";
import {
  accountSchema,
  AccountSchema,
} from "@/app/[locale]/account/utils/schema";
import { useAccountUpdate } from "@/app/[locale]/account/utils/use-account-update";

import { getAccountFormDefaultValues } from "../utils/utility";

type Props = {
  account: StorefrontAccount;
  onCompleted?: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
  }) => void;
};

export function AccountProfilePrompt({ account, onCompleted }: Props) {
  const t = useTranslations("account");
  const { currentCountry, languageId } = useTranslationsStore((s) => s);
  const {
    pending,
    toastOpen,
    toastMessage,
    setToastOpen,
    showToast,
    updateAccount,
  } =
    useAccountUpdate();
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);

  const selectedCountryCode =
    account.defaultCountry?.trim() ||
    currentCountry.countryCode?.trim() ||
    undefined;

  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
    defaultValues: useMemo(
      () => getAccountFormDefaultValues(account),
      [account],
    ),
  });

  async function onSubmit(data: AccountSchema) {
    if (!privacyPolicyChecked) {
      showToast(t("privacy policy is required"));
      return;
    }

    const result = await updateAccount({
      data,
      context: {
        languageId,
        currentCountryCode: currentCountry.countryCode,
      },
      mode: "full",
    });
    if (!result.ok) return;

    onCompleted?.({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      email: account.email?.trim() ?? "",
      country:
        data.defaultCountry?.trim().toLowerCase() ||
        selectedCountryCode?.toLowerCase() ||
        "",
    });
  }

  return (
    <>
      <div className="flex w-full max-w-md flex-col gap-14">
        <Text variant="uppercase" className="text-center">
          {t("complete your registration")}
        </Text>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10"
          >
            <AccountPersonalInfoFields
              disabled={pending}
              selectedCountryCode={selectedCountryCode}
            />
            <AccountRegistrationCheckboxSection
              form={form}
              disabled={pending}
              checked={privacyPolicyChecked}
              onCheckedChange={setPrivacyPolicyChecked}
            />
            <Button
              type="submit"
              variant="main"
              size="lg"
              className="w-full uppercase"
              loading={pending}
              disabled={pending}
            >
              {t("continue")}
            </Button>
          </form>
        </Form>
      </div>
      <SubmissionToaster
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { AccountPersonalInfoFields } from "@/app/[locale]/account/_components/personal-info-fields";
import { AccountRegistrationCheckboxSection } from "@/app/[locale]/account/_components/registration-checkbox-section";
import {
  accountSchema,
  AccountSchema,
} from "@/app/[locale]/account/utils/shema";

import {
  buildAccountUpdatePayload,
  getAccountFormDefaultValues,
} from "../utils/utility";

type Props = {
  account: StorefrontAccount;
};

export function AccountProfilePrompt({ account }: Props) {
  const router = useRouter();
  const { currentCountry, languageId } = useTranslationsStore((s) => s);
  const [pending, setPending] = useState(false);

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
    setPending(true);
    try {
      const payload = buildAccountUpdatePayload(
        data,
        {
          languageId,
          currentCountryCode: currentCountry.countryCode,
        },
        "full",
      );

      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        await res.json().catch(() => null);
        return;
      }

      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-14">
      <Text variant="uppercase" className="text-center">
        complete your registration
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
          <AccountRegistrationCheckboxSection form={form} disabled={pending} />
          <Button
            type="submit"
            variant="main"
            size="lg"
            className="w-full uppercase"
            loading={pending}
            disabled={pending}
          >
            continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

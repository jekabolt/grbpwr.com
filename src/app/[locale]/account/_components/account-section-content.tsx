"use client";

import { useMemo } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Form } from "@/components/ui/form";

import {
  createAccountSchema,
  type AccountSchema,
} from "../utils/schema";
import {
  getAccountFormDefaultValues,
  type ActivePanel,
} from "../utils/utility";
import { ActiveAccountSection } from "./sections";

type Props = {
  account: StorefrontAccount;
  activePanel: ActivePanel;
  addressOptions?: {
    editResetKey?: number;
    onEditModeChange?: (isEditing: boolean) => void;
  };
};

export function AccountSectionContent({
  account,
  activePanel,
  addressOptions,
}: Props) {
  const { currentCountry } = useTranslationsStore((s) => s);
  const t = useTranslations("account");
  const locale = useLocale();
  const accountFormSchema = useMemo(() => createAccountSchema(t), [t]);
  const selectedCountryCode =
    currentCountry.countryCode?.trim() ||
    account.defaultCountry?.trim() ||
    undefined;

  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: useMemo(
      () => getAccountFormDefaultValues(account, locale),
      [account, locale],
    ),
  });

  return (
    <Form {...form}>
      <div className="flex h-full min-h-0 flex-col">
        <ActiveAccountSection
          activePanel={activePanel}
          selectedCountryCode={selectedCountryCode}
          account={account}
          addressOptions={addressOptions}
        />
      </div>
    </Form>
  );
}

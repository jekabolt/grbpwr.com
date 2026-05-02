"use client";

import { useMemo } from "react";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Form } from "@/components/ui/form";

import { accountSchema, type AccountSchema } from "../utils/schema";
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

  return (
    <Form {...form}>
      <ActiveAccountSection
        activePanel={activePanel}
        selectedCountryCode={selectedCountryCode}
        account={account}
        addressOptions={addressOptions}
      />
    </Form>
  );
}

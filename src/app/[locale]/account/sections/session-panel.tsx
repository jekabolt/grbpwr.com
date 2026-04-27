"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { ActiveAccountSection } from "@/app/[locale]/account/_components/sections";
import {
  accountSchema,
  AccountSchema,
} from "@/app/[locale]/account/utils/schema";

import {
  ACCOUNT_SECTIONS,
  ActivePanel,
  getAccountFormDefaultValues,
} from "../utils/utility";

const ACCOUNT_PANEL_QUERY = "account_panel";

const ACCOUNT_PANEL_VALUES = new Set<ActivePanel>(
  ACCOUNT_SECTIONS.map((s) => s.value),
);

type Props = {
  account: StorefrontAccount;
};

export function AccountSessionPanel({ account }: Props) {
  const t = useTranslations("account");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentCountry } = useTranslationsStore((s) => s);

  const rawPanel = searchParams.get(ACCOUNT_PANEL_QUERY);
  const activePanel: ActivePanel =
    rawPanel && ACCOUNT_PANEL_VALUES.has(rawPanel as ActivePanel)
      ? (rawPanel as ActivePanel)
      : "order&returns";

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

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("checkout-form-storage");
      sessionStorage.removeItem("checkout-country-change-stash");
    }
    router.replace("/");
    router.refresh();
  }

  function togglePanel(panel: ActivePanel) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(ACCOUNT_PANEL_QUERY, panel);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-0 lg:overflow-y-auto">
      <div className="flex flex-col gap-12">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Text variant="uppercase">
              {account.firstName} {account.lastName}
            </Text>
            <Text variant="inactive">{account.email}</Text>
          </div>
          <Button
            type="button"
            variant="underline"
            className="block self-start uppercase leading-none hover:text-textColor lg:hidden"
            onClick={logout}
          >
            log out
          </Button>
        </div>
        <div className="space-y-3">
          {ACCOUNT_SECTIONS.map((section) => (
            <Button
              type="button"
              key={section.value}
              variant={activePanel === section.value ? "underline" : "default"}
              onClick={() => togglePanel(section.value)}
              className="uppercase"
            >
              {t(section.label)}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          className="hidden self-start uppercase text-textInactiveColor hover:text-textColor lg:block"
          onClick={logout}
        >
          log out
        </Button>
      </div>
      <div className="w-full pb-24 lg:pb-0">
        <Form {...form}>
          <ActiveAccountSection
            activePanel={activePanel}
            selectedCountryCode={selectedCountryCode}
            account={account}
          />
        </Form>
      </div>
    </div>
  );
}

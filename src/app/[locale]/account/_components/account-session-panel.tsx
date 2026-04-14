"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { ActiveAccountSection } from "@/app/[locale]/account/_components/account-sections";
import {
  accountSchema,
  AccountSchema,
} from "@/app/[locale]/account/utils/shema";

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
  const router = useRouter();
  const { currentCountry } = useTranslationsStore((s) => s);
  const [activePanel, setActivePanel] = useState<ActivePanel>("personal");

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(ACCOUNT_PANEL_QUERY);
    if (!raw || !ACCOUNT_PANEL_VALUES.has(raw as ActivePanel)) return;
    setActivePanel(raw as ActivePanel);
    params.delete(ACCOUNT_PANEL_QUERY);
    const qs = params.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", next);
  }, []);

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
    router.refresh();
  }

  function togglePanel(panel: ActivePanel) {
    setActivePanel((prev) => (prev === panel ? "personal" : panel));
  }

  return (
    <div className="w-full lg:relative lg:min-h-screen lg:px-32 lg:py-24">
      <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:gap-0">
        <div className="flex flex-col gap-12">
          <div className="space-y-2">
            <Text variant="uppercase">
              {account.firstName} {account.lastName}
            </Text>
            <Text variant="inactive">{account.email}</Text>
          </div>
          <div className="space-y-3">
            {ACCOUNT_SECTIONS.map((section) => (
              <Button
                type="button"
                key={section.value}
                variant={
                  activePanel === section.value ? "underline" : "default"
                }
                onClick={() => togglePanel(section.value)}
                className="uppercase"
              >
                {section.label}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            className="self-start uppercase text-textInactiveColor hover:text-textColor"
            onClick={logout}
          >
            log out
          </Button>
        </div>
        <div>
          <Form {...form}>
            <ActiveAccountSection
              activePanel={activePanel}
              selectedCountryCode={selectedCountryCode}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

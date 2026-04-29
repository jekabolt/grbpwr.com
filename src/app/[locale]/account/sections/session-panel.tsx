"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { AccountSectionContent } from "../_components/account-section-content";
import { ACCOUNT_SECTIONS, ActivePanel } from "../utils/utility";

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

  const rawPanel = searchParams.get(ACCOUNT_PANEL_QUERY);
  const activePanel: ActivePanel =
    rawPanel && ACCOUNT_PANEL_VALUES.has(rawPanel as ActivePanel)
      ? (rawPanel as ActivePanel)
      : "order&returns";

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
        </div>
        <div className="space-y-5 lg:space-y-3">
          {ACCOUNT_SECTIONS.map((section) => (
            <div key={section.value}>
              <Button
                type="button"
                variant={
                  activePanel === section.value ? "underline" : "default"
                }
                onClick={() => togglePanel(section.value)}
                className="hidden uppercase lg:block"
              >
                {t(section.label)}
              </Button>
              <AnimatedButton
                animationDuration={1000}
                animationArea="full-underline"
                className="flex w-full items-center justify-between text-left uppercase lg:hidden"
                href={`/account/${section.path}`}
              >
                <Text>{t(section.label)}</Text>
                <Text>{">"}</Text>
              </AnimatedButton>
            </div>
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
      <div className="hidden w-full pb-24 lg:block lg:pb-0">
        <AccountSectionContent account={account} activePanel={activePanel} />
      </div>
    </div>
  );
}

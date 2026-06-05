"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLocalizedHref } from "@/lib/navigation/use-localized-href";
import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { AccountProfile } from "@/lib/stores/account-onboarding/store-types";
import {
  createContentPagesLinks,
  createMenuItems,
  MenuItem,
} from "@/lib/utils";
import { MobileCountriesPopupTrigger } from "@/app/[locale]/_components/mobile-countries-popup";
import NewslatterForm from "@/app/[locale]/_components/newsletter-form";

import { AnimatedButton } from "./animated-button";
import { Text } from "./text";

type Gender = "men" | "women" | undefined;

const LOCALIZED_PATH_PREFIX = /^(\/[A-Za-z]{2}\/[a-z]{2})/;

function resolveHref(
  href: string,
  localized: (href: string) => string,
): string {
  return LOCALIZED_PATH_PREFIX.test(href) ? href : localized(href);
}

function isSamePathPage(
  pathname: string,
  href: string,
  localized: (href: string) => string,
): boolean {
  const resolved = resolveHref(href, localized);
  return !resolved.includes("?") && pathname === resolved;
}

function useSamePageClose(closeMenu: () => void) {
  const pathname = usePathname();
  const localized = useLocalizedHref();

  return (href: string) => {
    if (isSamePathPage(pathname || "", href, localized)) {
      closeMenu();
    }
  };
}

interface DefaultMenuProps {
  isWebsiteEnabled?: boolean;
  closeMenu: () => void;
}

export function DefaultMobileMenuDialog({
  isWebsiteEnabled = true,
  closeMenu,
}: DefaultMenuProps) {
  const { account, isSignedIn } = useAccountOnboardingStore((s) => s);
  const defaultMenuItems = isWebsiteEnabled
    ? createMenuItems()
    : [{ label: "timeline", showArrow: false, href: "/timeline" }];
  const contentPagesLinks = createContentPagesLinks();

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex min-h-0 flex-1 flex-col gap-10">
        <div className="min-h-0 flex-[0.4]">
          <MobileMenuBtns items={defaultMenuItems} closeMenu={closeMenu} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col border-t border-textColor pt-12">
          {isSignedIn ? (
            <SignedInContent
              closeMenu={closeMenu}
              account={account}
              contentPagesLinks={contentPagesLinks}
            />
          ) : (
            <NotSignedInContent
              closeMenu={closeMenu}
              contentPagesLinks={contentPagesLinks}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SignedInContent({
  closeMenu,
  account,
  contentPagesLinks,
}: {
  closeMenu: () => void;
  account: AccountProfile | null;
  contentPagesLinks: MenuItem[];
}) {
  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-5">
      <div className="flex flex-col gap-5">
        <AccountMenuButton closeMenu={closeMenu} account={account} />
        <MobileMenuBtns items={contentPagesLinks} closeMenu={closeMenu} />
      </div>
      <MobileCountriesPopupTrigger />
    </div>
  );
}

function NotSignedInContent({
  closeMenu,
  contentPagesLinks,
}: {
  closeMenu: () => void;
  contentPagesLinks: MenuItem[];
}) {
  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-5">
      <div className="flex flex-col gap-5">
        <MobileCountriesPopupTrigger />
        <AccountMenuButton closeMenu={closeMenu} account={null} />
        <MobileMenuBtns items={contentPagesLinks} closeMenu={closeMenu} />
      </div>
      <NewslatterForm inactiveBgColor />
    </div>
  );
}

function AccountMenuButton({
  closeMenu,
  account,
}: {
  closeMenu: () => void;
  account: AccountProfile | null;
}) {
  const localized = useLocalizedHref();
  const closeIfSamePage = useSamePageClose(closeMenu);
  const tAccount = useTranslations("account");

  return (
    <AnimatedButton
      animationDuration={1000}
      href={localized("/account")}
      onClick={() => closeIfSamePage("/account")}
      className={account ? undefined : "uppercase"}
    >
      {account ? (
        <div className="flex justify-between">
          <Text variant="uppercase">{tAccount("account")}:</Text>
          <Text variant="uppercase" className="underline">
            {account.firstName}
          </Text>
        </div>
      ) : (
        <Text>{tAccount("log in")}</Text>
      )}
    </AnimatedButton>
  );
}

function MobileMenuBtns({
  items,
  closeMenu,
}: {
  items: MenuItem[];
  closeMenu: () => void;
}) {
  const closeIfSamePage = useSamePageClose(closeMenu);
  const t = useTranslations("navigation");

  return (
    <div className="flex flex-col gap-5">
      {items.map((i) => (
        <div key={i.label} className="w-full">
          <AnimatedButton
            animationDuration={1000}
            animationArea="full-underline"
            href={i.href}
            onClick={() => closeIfSamePage(i.href)}
            className="flex w-full items-center justify-between uppercase"
          >
            <Text>{t(i.label)}</Text>
            {i.showArrow && <Text>{">"}</Text>}
          </AnimatedButton>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { USER_TIER } from "@/constants";
import { useTranslations } from "next-intl";

import { useAccountOnboardingStore } from "@/lib/stores/account-onboarding/store-provider";
import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Announce } from "@/components/ui/announce";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";
import { Text } from "@/components/ui/text";

import { HeaderLeftNav } from "./header-left-nav";
import { useAnnounce } from "./useAnnounce";
import { useHeaderVisibility } from "./useHeaderVisibility";

export function Header({
  showAnnounce = false,
  theme,
}: {
  showAnnounce?: boolean;
  theme?: "light" | "dark";
}) {
  const { dictionary } = useDataContext();
  const { isOpen, toggleCart } = useCart((state) => state);
  const { products } = useCart((state) => state);
  const { isSignedIn, account } = useAccountOnboardingStore((s) => s);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isBigMenuEnabled = dictionary?.bigMenu;
  const itemsQuantity = Object.keys(products).length;
  const { isVisible, isAnnounceVisible, isAtTop, isMobile } =
    useHeaderVisibility();
  const { languageId } = useTranslationsStore((state) => state);
  const announceTranslation = dictionary?.announce?.translations?.find(
    (t) => t.languageId === languageId,
  );
  const { open, handleClose } = useAnnounce(announceTranslation?.text || "");
  const t = useTranslations("navigation");
  const tAccount = useTranslations("account");
  const isWebsiteEnabled = dictionary?.siteEnabled;
  const userTier = account?.accountTier ? USER_TIER[account.accountTier] : "";
  const isHacker = account?.accountTier === "ACCOUNT_TIER_ENUM_HACKER";
  const tierText = isHacker ? "hacker" : userTier;

  return (
    <>
      {showAnnounce && (
        <Announce
          open={open}
          onClose={handleClose}
          isVisible={isAnnounceVisible}
        />
      )}
      <header
        className={cn(
          "fixed inset-x-2.5 z-30 h-12 py-2 selection:bg-inverted selection:text-textColor lg:gap-0 lg:px-5 lg:py-3",
          "flex items-center justify-between gap-1",
          "border border-textInactiveColor bg-bgColor text-textColor lg:border-transparent",
          "transition-[top] duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          {
            "top-2": isVisible,
            "-top-16": !isVisible,
            "lg:top-8": open && showAnnounce && isAnnounceVisible,
            "border-none bg-transparent text-bgColor mix-blend-exclusion":
              isAtTop && isMobile && theme !== "dark",
            "border-none bg-transparent text-textColor mix-blend-exclusion":
              isAtTop && isMobile && theme === "dark",
            "border-none": isAtTop && showAnnounce && !isNavOpen,
            "lg:bg-transparent lg:text-bgColor lg:mix-blend-exclusion":
              (!isNavOpen || !isBigMenuEnabled) && theme !== "dark",
            "lg:bg-transparent lg:text-textColor lg:mix-blend-exclusion":
              (!isNavOpen || !isBigMenuEnabled) && theme === "dark",
            "lg:border-textInactiveColor lg:bg-bgColor lg:text-textColor lg:mix-blend-normal":
              isNavOpen && isBigMenuEnabled,
            "lg:border-none": !isBigMenuEnabled,
          },
        )}
      >
        <HeaderLeftNav
          showAnnounce={showAnnounce}
          onNavOpenChange={setIsNavOpen}
          isBigMenuEnabled={isBigMenuEnabled}
          isWebsiteEnabled={isWebsiteEnabled}
          isMobile={isMobile}
        />

        {!(isWebsiteEnabled === false && isMobile) && (
          <Button
            asChild
            size="lg"
            className={cn(
              "w-1/3 text-center transition-colors hover:opacity-70 active:opacity-50 lg:w-auto",
            )}
          >
            <Link
              href="/"
              className="inline-flex items-center whitespace-nowrap [font-variant-ligatures:none]"
            >
              {isSignedIn ? (
                <>
                  <Text>grbpwr</Text>
                  {tierText ? (
                    <Text className="ml-[1px]">{tierText}</Text>
                  ) : null}
                </>
              ) : (
                "grbpwr"
              )}
            </Link>
          </Button>
        )}

        <div className="flex grow basis-0 items-center justify-end">
          <div className="relative w-full lg:w-auto">
            <div className="block w-full lg:hidden">
              {isWebsiteEnabled ? (
                <MobileNavCart />
              ) : (
                <Button
                  size="lg"
                  className="z-50 w-full bg-transparent text-right transition-colors hover:opacity-70 active:opacity-50"
                  asChild
                >
                  <Link href="/timeline">{t("timeline")}</Link>
                </Button>
              )}
            </div>
            {isWebsiteEnabled && (
              <div className="hidden gap-3 lg:flex">
                <Button
                  size="sm"
                  className="underline-offset-2 transition-colors hover:underline hover:opacity-70 active:opacity-50"
                  asChild
                >
                  <Link href="/account">{tAccount("account")}</Link>
                </Button>

                <Button
                  onClick={toggleCart}
                  variant={isOpen ? "underline" : "default"}
                  size="sm"
                  className="underline-offset-2 transition-colors hover:underline hover:opacity-70 active:opacity-50"
                >
                  {t("cart")} {itemsQuantity ? itemsQuantity : ""}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

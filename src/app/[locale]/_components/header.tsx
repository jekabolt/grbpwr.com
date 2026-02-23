"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Announce } from "@/components/ui/announce";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

import { HeaderLeftNav } from "./header-left-nav";
import { useAnnounce } from "./useAnnounce";
import { useHeaderVisibility } from "./useHeaderVisibility";

export function Header({ showAnnounce = false }: { showAnnounce?: boolean }) {
  const { dictionary } = useDataContext();
  const { isOpen, toggleCart } = useCart((state) => state);
  const { products } = useCart((state) => state);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isBigMenuEnabled = dictionary?.bigMenu;
  const itemsQuantity = Object.keys(products).length;
  const { isVisible, isMobile, isAnnounceVisible, isAtTop } =
    useHeaderVisibility();
  const { languageId } = useTranslationsStore((state) => state);
  const announceTranslation = dictionary?.announce?.translations?.find(
    (t) => t.languageId === languageId,
  );
  const { open, handleClose } = useAnnounce(announceTranslation?.text || "");
  const t = useTranslations("navigation");

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
          "fixed inset-x-2.5 top-2 z-30 h-12 py-2 lg:gap-0 lg:px-5 lg:py-3",
          "flex items-center justify-between gap-1",
          "border border-textInactiveColor bg-bgColor text-textColor lg:border-transparent",
          "transform-gpu transition-transform duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          "lg:transform-none lg:transition-[top] lg:duration-150 lg:ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          {
            "lg:top-8": open && showAnnounce && isAnnounceVisible,
            "pointer-events-auto translate-y-0": isVisible,
            "pointer-events-none -translate-y-[120%]": !isVisible,
            "border-none bg-transparent text-bgColor mix-blend-exclusion":
              isAtTop && isMobile,
            "border-none": isAtTop && showAnnounce && !isNavOpen,
            "lg:bg-transparent lg:text-bgColor lg:mix-blend-exclusion":
              !isNavOpen || !isBigMenuEnabled,
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
        />

        <Button
          asChild
          size="lg"
          className="w-1/3 text-center transition-colors hover:opacity-70 active:opacity-50 lg:w-auto"
        >
          <Link href="/">grbpwr</Link>
        </Button>

        <div className="flex grow basis-0 items-center justify-end">
          <div className="relative w-full lg:w-auto">
            <div className="block w-full lg:hidden">
              <MobileNavCart />
            </div>
            <div className="hidden lg:block">
              <Button
                onClick={toggleCart}
                variant={isOpen ? "underline" : "default"}
                size="sm"
                className="underline-offset-2 transition-colors hover:underline hover:opacity-70 active:opacity-50"
              >
                {t("cart")} {itemsQuantity ? itemsQuantity : ""}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

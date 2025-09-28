"use client";

import { useEffect, useState } from "react";
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
import { useHeaderScrollPosition } from "./useHeaderScrollPosition";

export function Header({ isCatalog }: { isCatalog?: boolean }) {
  const { dictionary } = useDataContext();
  const { isOpen, toggleCart } = useCart((state) => state);
  const { products } = useCart((state) => state);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isBigMenuEnabled = dictionary?.bigMenu;
  const itemsQuantity = Object.keys(products).length;
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollDirection, isAtTop } = useHeaderScrollPosition();
  const { languageId } = useTranslationsStore((state) => state);
  const announceTranslation = dictionary?.announceTranslations?.find(
    (t) => t.languageId === languageId,
  );
  const { open } = useAnnounce(announceTranslation?.text || "");
  const t = useTranslations("navigation");

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (scrollDirection === "down") {
        setIsVisible(false);
      } else if (scrollDirection === "up" || isAtTop) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, [scrollDirection, isAtTop, isMobile]);

  return (
    <>
      {!isCatalog && <Announce />}
      <header
        className={cn(
          "fixed inset-x-2.5 bottom-2 z-30 h-12 py-2 lg:top-2 lg:gap-0 lg:px-5 lg:py-3",
          "flex items-center justify-between gap-1",
          "blackTheme border border-textInactiveColor bg-textColor text-bgColor lg:border-transparent lg:bg-bgColor lg:text-textColor",
          "transform-gpu transition-transform duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:transform-none lg:transition-none",
          {
            "lg:top-8": open && !isCatalog,
            "pointer-events-auto translate-y-0": isVisible,
            "pointer-events-none translate-y-[120%]": !isVisible,
            "bg-bgColor text-textColor mix-blend-hard-light":
              isNavOpen && isAtTop && !isCatalog,
            "border-none bg-transparent text-textColor mix-blend-exclusion":
              isAtTop && !isNavOpen && !isCatalog,
            "lg:bg-transparent lg:mix-blend-exclusion":
              !isNavOpen || (isNavOpen && !isBigMenuEnabled),
            "lg:border-none": !isBigMenuEnabled,
          },
        )}
      >
        <HeaderLeftNav
          isCatalog={isCatalog}
          onNavOpenChange={setIsNavOpen}
          isBigMenuEnabled={isBigMenuEnabled}
        />

        <Button asChild size="lg" className="w-1/3 text-center lg:w-auto">
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
                className="underline-offset-2 hover:underline"
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

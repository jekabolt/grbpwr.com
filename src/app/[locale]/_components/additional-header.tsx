"use client";

import { useRouter } from "next/navigation";
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";

export function AdditionalHeader({
  left,
  center,
  right,
  hidden = false,
}: HeaderProps) {
  const router = useRouter();
  const { openCart, closeCart } = useCart((s) => s);
  const { currentCountry, languageId } = useTranslationsStore((s) => s);

  const country = currentCountry.countryCode?.toLowerCase() || "gb";
  const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
  const homePath = `/${country}/${locale}`;

  const handleLeftClick = () => {
    closeCart();
    if (typeof window === "undefined") {
      router.push(homePath);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }
    try {
      const ref = document.referrer;
      if (ref) {
        const refUrl = new URL(ref);
        if (refUrl.origin === window.location.origin) {
          router.push(`${refUrl.pathname}${refUrl.search}${refUrl.hash}`);
          return;
        }
      }
    } catch {
      /* invalid referrer */
    }
    router.push(homePath);
  };

  const handleRightClick = () => {
    openCart();
    router.push(homePath);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 top-2.5 z-30 h-12 py-2 lg:top-2 lg:gap-0 lg:px-5 lg:py-3",
        "flex items-center justify-between gap-1",
        "blackTheme bg-transparent text-textColor mix-blend-exclusion",
      )}
    >
      <AnimatedButton
        animationArea="text"
        className="py-3 pl-2.5 pr-8 lg:pl-0"
        onClick={handleLeftClick}
      >
        {left}
      </AnimatedButton>
      <div className="flex-none text-center text-textBaseSize">{center}</div>
      <AnimatedButton
        onClick={handleRightClick}
        animationArea="text"
        className="hidden hover:underline lg:block"
      >
        {right}
      </AnimatedButton>
      <AnimatedButton
        onClick={handleRightClick}
        animationArea="text"
        className={cn("block pr-2.5 lg:hidden", {
          hidden: hidden,
        })}
      >
        [x]
      </AnimatedButton>
    </header>
  );
}

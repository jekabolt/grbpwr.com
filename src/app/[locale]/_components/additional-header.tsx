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

  // Preserve current locale when closing (don't switch to country's default)
  const country = currentCountry.countryCode?.toLowerCase() || "us";
  const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
  const homePath = `/${country}/${locale}`;

  const handleLeftClick = () => {
    closeCart();
    router.push(homePath);
  };

  const handleRightClick = () => {
    openCart();
    router.push(homePath);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 top-2 z-30 h-12 py-2 lg:gap-0 lg:px-5 lg:py-3",
        "flex items-center justify-between gap-1",
        "blackTheme bg-transparent text-textColor mix-blend-exclusion",
      )}
    >
      <AnimatedButton
        animationArea="text"
        className="py-3 pr-8"
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
        className={cn("block lg:hidden", {
          hidden: hidden,
        })}
      >
        [x]
      </AnimatedButton>
    </header>
  );
}

"use client";

import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

export function MobileProductInfoHeader({ left, link, onClick }: HeaderProps) {
  return (
    <header className="fixed inset-x-2.5 top-2 z-50 flex h-12 items-center justify-between py-2">
      {onClick ? (
        <AnimatedButton
          onClick={onClick}
          className="w-1/3 py-2.5 pl-4 text-left"
          animationArea="text"
          animationDuration={300}
        >
          {left}
        </AnimatedButton>
      ) : (
        <AnimatedButton
          href={link || "/catalog"}
          className="w-1/3 py-2.5 pl-4 text-left"
          animationArea="text"
          animationDuration={300}
        >
          {left}
        </AnimatedButton>
      )}
      <MobileNavCart isProductInfo />
    </header>
  );
}

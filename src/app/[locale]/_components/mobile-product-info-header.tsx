"use client";

import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

export function MobileProductInfoHeader({ left, link, onClick }: HeaderProps) {
  return (
    <>
      {/* Safari dynamic island tint: fixed element with explicit bg so Safari uses it for toolbar tinting. Transparent = black. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[9] min-h-[4px] bg-bgColor [height:env(safe-area-inset-top)]"
        aria-hidden
      />
      <header className="fixed inset-x-2.5 top-2.5 z-10 flex items-center justify-between">
      {onClick ? (
        <AnimatedButton
          onClick={onClick}
          className="w-1/3 py-2.5 pl-2.5 text-left"
          animationArea="text"
        >
          {left}
        </AnimatedButton>
      ) : (
        <AnimatedButton
          href={link || "/catalog"}
          className="w-1/3 py-2.5 pl-2.5 text-left"
          animationArea="text"
        >
          {left}
        </AnimatedButton>
      )}
      <MobileNavCart isProductInfo />
    </header>
    </>
  );
}

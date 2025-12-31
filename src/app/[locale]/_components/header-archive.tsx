"use client";

import { cn } from "@/lib/utils";
import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";

import { useHeaderVisibility } from "./useHeaderVisibility";

export function HeaderArchive({ left, center, link }: HeaderProps) {
  const { isVisible, isMobile, isAtTop } = useHeaderVisibility();

  return (
    <header
      className={cn(
        "blackTheme fixed inset-x-2.5 top-2 z-30 flex h-12 items-center border border-textInactiveColor bg-bgColor px-4 py-2 text-textColor lg:gap-0 lg:border-transparent lg:px-5 lg:py-3 lg:text-textColor lg:mix-blend-exclusion",
        "transform-gpu transition-transform duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "lg:transform-none",
        {
          "pointer-events-auto translate-y-0": isVisible,
          "pointer-events-none -translate-y-[120%]": !isVisible,
          "border-none": isAtTop && isMobile,
        },
      )}
    >
      <div className="flex w-full items-center justify-between lg:justify-start lg:gap-3">
        <AnimatedButton href={link ? link : "/"}>{left}</AnimatedButton>
        <AnimatedButton
          href="/timeline"
          className="block lg:flex lg:grow lg:basis-0 lg:text-left"
        >
          {center}
        </AnimatedButton>
      </div>
    </header>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";

export function AdditionalHeader({
  left,
  center,
  right,
  hidden = false,
  isAnnounceDismissed,
}: HeaderProps) {
  const router = useRouter();
  const { openCart } = useCart((s) => s);

  const handleLeftClick = () => {
    openCart();
    router.push("/");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 top-2 z-30 h-12 py-2 lg:gap-0 lg:px-5 lg:py-3",
        "flex items-center justify-between gap-1",
        "blackTheme bg-transparent text-textColor mix-blend-exclusion",
        {
          "top-6": isAnnounceDismissed === null,
        },
      )}
    >
      <AnimatedButton animationArea="text" onClick={handleLeftClick}>
        {left}
      </AnimatedButton>
      <div className="flex-none text-center text-textBaseSize">{center}</div>
      <AnimatedButton
        href="/"
        animationArea="text"
        className="hidden hover:underline lg:block"
      >
        {right}
      </AnimatedButton>
      <AnimatedButton
        href="/"
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

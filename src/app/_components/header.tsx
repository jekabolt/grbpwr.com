"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

import { HeaderLeftNav } from "./header-left-nav";

export function Header({ isCatalog }: { isCatalog?: boolean }) {
  const { dictionary } = useDataContext();
  const { isOpen, toggleCart } = useCart((state) => state);
  const { products } = useCart((state) => state);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isBigMenuEnabled = dictionary?.bigMenu;
  const itemsQuantity = Object.keys(products).length;
  const [isVisible, setIsVisible] = useState(true);
  const { scrollDirection, isAtTop } = useScrollPosition();

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      // Показываем навбар только при скролле вверх или когда на вершине
      if (scrollDirection === "down") {
        setIsVisible(false);
      } else if (scrollDirection === "up" || isAtTop) {
        setIsVisible(true);
      }
    } else {
      // На десктопе всегда показываем
      setIsVisible(true);
    }
  }, [scrollDirection, isAtTop]);

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 bottom-2 z-30 h-12 py-2 lg:top-2 lg:gap-0 lg:px-5 lg:py-3",
        "flex items-center justify-between gap-1",
        "blackTheme border border-textInactiveColor bg-textColor text-bgColor lg:border-transparent lg:bg-bgColor lg:text-textColor",
        "transform-gpu transition-transform duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]", // transition-all вместо transition-transform
        {
          // Показать навбар
          "pointer-events-auto translate-y-0": isVisible,
          // Скрыть навбар полностью
          "pointer-events-none translate-y-[120%]": !isVisible, // Увеличил отступ
          // Остальные условия
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
              cart {itemsQuantity ? itemsQuantity : ""}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function useScrollPosition() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let downAccumulator = 0;
    let upAccumulator = 0;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;

      setIsAtTop(scrollY === 0);

      if (scrollY === lastScrollY) return;

      const delta = scrollY - lastScrollY;

      if (delta > 0) {
        // Скролл вниз
        downAccumulator += delta;
        upAccumulator = 0; // Сбрасываем счетчик вверх

        if (downAccumulator >= 250 && scrollDirection !== "down") {
          setScrollDirection("down");
        }
      } else {
        // Скролл вверх
        upAccumulator += Math.abs(delta);
        downAccumulator = 0; // Сбрасываем счетчик вниз

        if (upAccumulator >= 10 && scrollDirection !== "up") {
          setScrollDirection("up");
        }
      }

      lastScrollY = scrollY;
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollDirection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollDirection]);

  return { scrollDirection, isAtTop };
}

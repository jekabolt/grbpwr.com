"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

import { HeaderLeftNav } from "./header-left-nav";

export function Header() {
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
      if (scrollDirection === "down") {
        setIsVisible(false);
      } else if (scrollDirection === "up") {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, [scrollDirection]);

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 bottom-2 z-30 h-12 py-2 lg:top-2 lg:gap-0 lg:px-5 lg:py-3",
        "flex items-center justify-between gap-1",
        "blackTheme border border-textInactiveColor bg-textColor text-bgColor lg:border-transparent lg:bg-bgColor lg:text-textColor",
        "transition-all duration-300 ease-in-out",
        {
          hidden: !isVisible,
          flex: isVisible,
          "bg-bgColor text-textColor mix-blend-hard-light": isNavOpen,
          "border-none bg-transparent text-textColor mix-blend-exclusion":
            isAtTop,
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

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";

      setIsAtTop(scrollY === 0);

      if (Math.abs(scrollY - lastScrollY) < 10) {
        return;
      }

      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);

    updateScrollDirection();

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return { scrollDirection, isAtTop };
}

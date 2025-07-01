"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

import { HeaderLeftNav } from "./header-left-nav";

export function Header({
  mode = "default",
}: {
  mode?: "inverted" | "default" | "transparent";
}) {
  const { dictionary } = useDataContext();
  const { isOpen, toggleCart } = useCart((state) => state);
  const { products } = useCart((state) => state);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isBigMenuEnabled = dictionary?.bigMenu;
  const [isScrolled, setIsScrolled] = useState(false);
  const itemsQuantity = Object.keys(products).length;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 bottom-2 z-30 flex h-12 items-center justify-between gap-1 border-textInactiveColor py-2 lg:top-2 lg:gap-0 lg:border lg:border-transparent lg:px-5 lg:py-3",
        {
          "bg-textColor text-bgColor mix-blend-hard-light lg:bg-bgColor lg:text-textColor lg:mix-blend-exclusion":
            mode === "inverted",
          "lg:bg-transparent lg:text-bgColor":
            mode === "inverted" && isScrolled && !isNavOpen,
          "bg-textColor text-bgColor mix-blend-hard-light lg:bg-transparent lg:mix-blend-exclusion":
            mode === "transparent",
          "bg-bgColor text-textColor mix-blend-normal":
            mode === "transparent" && isNavOpen && isBigMenuEnabled,
          "lg:border-x lg:border-t lg:border-textInactiveColor": isNavOpen,
          "border-none": !isBigMenuEnabled,
          "bg-transparent text-bgColor": mode === "inverted" && isOpen,
        },
      )}
    >
      <HeaderLeftNav
        isNavOpen={isNavOpen}
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

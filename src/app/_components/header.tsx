"use client";

import { useState } from "react";
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

  return (
    <header
      className={cn(
        "blackTheme fixed inset-x-2.5 bottom-2 z-30 flex h-12 items-center justify-between gap-1 border-textInactiveColor bg-bgColor py-2 text-textColor lg:top-2 lg:gap-0 lg:border lg:border-transparent lg:px-5 lg:py-3",
        {
          "bg-bgColor text-textColor mix-blend-hard-light": isNavOpen,
          "bg-transparent mix-blend-exclusion": !isNavOpen,
          "border-none": !isBigMenuEnabled,
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

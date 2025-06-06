"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";
import { HeaderLeftNav } from "./header-left-nav";

export function Header({ transparent }: { transparent?: boolean }) {
  const { dictionary } = useDataContext();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isBigMenuEnabled = dictionary?.bigMenu;

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 bottom-2 z-30 flex h-12 items-center justify-between gap-1 border-textInactiveColor bg-bgColor py-2 text-textColor lg:top-2 lg:gap-0 lg:border lg:border-transparent lg:px-5 lg:py-3",
        {
          "lg:border-x lg:border-t lg:border-textInactiveColor": isNavOpen,
          "bg-transparent": transparent,
          "bg-bgColor": transparent && isNavOpen,
          "border-none": !isBigMenuEnabled,
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
        <CartPopup>
          <div className="h-full overflow-y-scroll">
            <CartProductsList />
          </div>
          <CartTotalPrice />
        </CartPopup>
      </div>
    </header>
  );
}

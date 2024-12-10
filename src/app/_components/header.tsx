"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NavigationMenuComponent } from "@/components/ui/nav-menu";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";
import CurrencyPopover from "./currency-popover";

export function Header() {
  return (
    <header className="text sticky top-2 z-20 flex h-12 items-center justify-between bg-textColor p-3 py-2 lg:px-5 lg:py-3">
      <NavigationMenuComponent className="grow basis-0" />

      <Link
        href="/"
        className="flex-none text-center text-bgColor hover:animate-ping"
      >
        grbpwr
      </Link>

      <div className="flex grow basis-0 items-center justify-end gap-x-5">
        <CurrencyPopover />

        <CartPopup>
          <div className="relative max-h-[500px] space-y-6 overflow-y-scroll">
            <CartProductsList />
          </div>
          <CartTotalPrice />
        </CartPopup>
      </div>
    </header>
  );
}

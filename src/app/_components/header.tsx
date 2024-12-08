"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";
import CurrencyPopover from "./currency-popover";

export function Header() {
  return (
    <header className="text sticky top-2 z-20 flex items-center justify-between bg-textColor p-3 py-2 lg:px-5 lg:py-3">
      <nav className="flex gap-x-1">
        <Button asChild variant="main">
          <Link href="/catalog">catalog</Link>
        </Button>
        <Button asChild variant="main">
          <Link href="/catalog">ss{"'"}25</Link>
        </Button>
        <Button asChild variant="main">
          <Link href="/archive">archive</Link>
        </Button>
      </nav>

      <Button asChild variant="main" className="flex-none">
        <Link href="/" className="flex-1 text-center">
          grbpwr
        </Link>
      </Button>

      <div className="flex items-center gap-x-1">
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

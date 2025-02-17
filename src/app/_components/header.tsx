"use client";

import Link from "next/link";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";
import { HeaderLeftNav } from "./header-left-nav";

export function Header() {
  return (
    <header className="text fixed bottom-2 left-2 right-2 z-30 flex h-12 items-center justify-between bg-bgColor p-3 py-2 text-textColor lg:top-2 lg:mx-2 lg:px-5 lg:py-3">
      <HeaderLeftNav />

      <Link href="/" className="flex-none text-center text-textSmallSize">
        grbpwr
      </Link>

      <div className="flex grow basis-0 items-center justify-end">
        <CartPopup>
          <div className="no-scroll-bar h-full overflow-y-scroll">
            <CartProductsList />
          </div>
          <CartTotalPrice />
        </CartPopup>
      </div>
    </header>
  );
}

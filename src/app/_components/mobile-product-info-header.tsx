import Link from "next/link";

import { Button } from "@/components/ui/button";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";

// fixed postion for header + transparent bgColor

export function MobileProductInfoHeader() {
  return (
    <header className="flex justify-between px-2.5 pt-5">
      <Button asChild>
        <Link href="/catalog">{`<`}</Link>
      </Button>
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

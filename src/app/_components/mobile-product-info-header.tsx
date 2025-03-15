import Link from "next/link";

import { Button } from "@/components/ui/button";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";

export function MobileProductInfoHeader() {
  return (
    <header className="fixed inset-x-2.5 top-5 z-10 flex justify-between">
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

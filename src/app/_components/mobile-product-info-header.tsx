import Link from "next/link";

import { Button } from "@/components/ui/button";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";

export function MobileProductInfoHeader() {
  return (
    <header className="fixed inset-x-2.5 top-5 z-10 flex items-center justify-between">
      <Button size="lg" asChild className="w-1/3 border border-red-500">
        <Link href="/catalog">{`<`}</Link>
      </Button>
      <div className="flex w-1/3 items-center justify-end border border-blue-500">
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

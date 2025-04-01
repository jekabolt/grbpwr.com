import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";

// TODO: make so that this component reuses same props as desktop (headerAdditionalProps)
// сейчас здесь захардкожен тип каталог надо сделать чтобы был флексибл
export function MobileProductInfoHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "fixed inset-x-2.5 top-5 z-10 flex items-center justify-between",
        className,
      )}
    >
      <Button size="lg" asChild className="w-1/3">
        <Link href="/catalog">{`<`}</Link>
      </Button>
      <div className="flex w-1/3 items-center justify-end">
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

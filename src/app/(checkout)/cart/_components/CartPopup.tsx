"use client";

import { useState } from "react";
import Link from "next/link";
import { useClickAway } from "@uidotdev/usehooks";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const products = useCart((state) => state.products);
  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity
    ? itemsQuantity.toString().padStart(2, "0")
    : "";
  const [open, setOpenStatus] = useState(false);

  const ref = useClickAway<HTMLDivElement>(() => {
    setOpenStatus(false);
  });

  return (
    <>
      {open && itemsQuantity > 0 && <Overlay cover="screen" />}
      <div className="block lg:hidden">
        <MobileNavCart />
      </div>
      <div className="hidden lg:block" ref={ref}>
        <Button
          onClick={() => setOpenStatus((v) => !v)}
          variant={open ? "underline" : "default"}
          size="sm"
          className="underline-offset-2 hover:underline"
        >
          cart {itemsQuantity ? itemsQuantity : ""}
        </Button>

        <div
          className={cn(
            "right-0 top-0 z-30 hidden w-[500px] bg-bgColor p-2.5",
            {
              block: open,
              "fixed h-screen": itemsQuantity > 0,
              "absolute w-72": itemsQuantity === 0,
            },
          )}
        >
          <div className="flex h-full flex-col gap-y-6">
            <div className="flex items-center justify-between">
              <Text variant="uppercase">{`shopping cart [${cartCount}]`}</Text>

              <Button onClick={() => setOpenStatus((v) => !v)}>[X]</Button>
            </div>
            {itemsQuantity > 0 ? (
              <>
                {children}
                <Button
                  asChild
                  variant="main"
                  size="lg"
                  className="block w-full uppercase"
                >
                  <Link href="/checkout">proceed to checkout</Link>
                </Button>
              </>
            ) : (
              <Text variant="uppercase">empty</Text>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

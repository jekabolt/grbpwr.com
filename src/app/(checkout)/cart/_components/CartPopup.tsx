"use client";

import Link from "next/link";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const { products, isOpen, closeCart, toggleCart } = useCart((state) => state);
  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  return (
    <div className="relative">
      {isOpen && itemsQuantity > 0 && (
        <Overlay cover="screen" onClick={closeCart} />
      )}
      <div className="block lg:hidden">
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

        {isOpen && (
          <div
            className={cn("right-0 top-0 z-30 w-[500px] bg-bgColor p-2.5", {
              "fixed h-screen": itemsQuantity > 0,
              "absolute w-72": itemsQuantity === 0,
            })}
          >
            <div className="flex h-full flex-col gap-y-6">
              <div className="flex items-center justify-between">
                <Text variant="uppercase">{`shopping cart ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
                <Button onClick={closeCart}>[X]</Button>
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
        )}
      </div>
    </div>
  );
}

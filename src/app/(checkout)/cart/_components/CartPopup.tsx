"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const { products, isOpen, closeCart, toggleCart } = useCart((state) => state);
  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="z-50 w-full">
      {isOpen && (
        <Overlay
          cover="screen"
          onClick={closeCart}
          disablePointerEvents={false}
        />
      )}
      <div className="hidden lg:block">
        {isOpen && (
          <div className="blackTheme fixed right-0 top-0 z-30 h-screen w-[500px] bg-bgColor p-2.5 text-textColor">
            <div className="flex h-full flex-col gap-y-6">
              <div className="flex items-center justify-between">
                <Text variant="uppercase">{`shopping cart ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
                <Button onClick={closeCart}>[x]</Button>
              </div>
              {!itemsQuantity ? (
                <div className="flex h-full items-center justify-center">
                  <Text>nothing</Text>
                </div>
              ) : (
                <>{children}</>
              )}
              {itemsQuantity > 0 && (
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="block w-full uppercase"
                  id="checkout_btn"
                >
                  <Link href="/checkout">proceed to checkout</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

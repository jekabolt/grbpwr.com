"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const { products, isOpen, closeCart, toggleCart } = useCart((state) => state);
  const { handleBeginCheckoutEvent } = useCheckoutAnalytics({});

  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");
  const t = useTranslations("cart");

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
  }, [isOpen, closeCart]);

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
                <Text variant="uppercase">{`${t("shopping cart")} ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
                <Button onClick={closeCart}>[x]</Button>
              </div>
              {!itemsQuantity ? (
                <div className="flex h-full items-center justify-center">
                  <Text>{t("empty")}</Text>
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
                  onMouseDown={handleBeginCheckoutEvent}
                >
                  <Link href="/checkout">{t("proceed to checkout")}</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

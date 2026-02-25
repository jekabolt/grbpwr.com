"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { useCart } from "@/lib/stores/cart/store-provider";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { products, isOpen, closeCart } = useCart((state) => state);

  const { handleBeginCheckoutEvent } = useCheckoutAnalytics();

  const t = useTranslations("cart");

  const itemsQuantity = products.length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      if (products.length > 0) router.prefetch("/checkout");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart, products.length, router]);

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
          <div className="fixed inset-y-2 right-2 z-30 w-[500px] border border-textInactiveColor bg-bgColor p-2.5 text-textColor">
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
                >
                  <Link
                    href="/checkout"
                    prefetch
                    onClick={() => handleBeginCheckoutEvent()}
                  >
                    {t("proceed to checkout")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useCheckoutAnalytics } from "@/lib/analitycs/useCheckoutAnalytics";
import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { ModalTransition } from "@/components/modal-transition";
import CartProductsList from "@/app/[locale]/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/[locale]/(checkout)/cart/_components/CartTotalPrice";

import { Button } from "./button";
import { Text } from "./text";

export function MobileNavCart({
  isProductInfo = false,
}: {
  isProductInfo?: boolean;
}) {
  const router = useRouter();
  const { products, isOpen, openCart, closeCart } = useCart((state) => state);
  const { handleBeginCheckoutEvent } = useCheckoutAnalytics();

  const t = useTranslations("navigation");
  const tCart = useTranslations("cart");
  const tAccessibility = useTranslations("accessibility");

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const open = isMobile && isOpen;

  useEffect(() => {
    if (open && products.length > 0) {
      router.prefetch("/checkout");
    }
  }, [open, products.length, router]);
  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  return (
    <>
      <DialogPrimitives.Root open={open} onOpenChange={closeCart}>
        <Button
          size={isProductInfo ? "default" : "lg"}
          onClick={openCart}
          className={cn("w-full bg-transparent text-right", {
            "w-1/3 py-2.5 pr-2.5": isProductInfo,
          })}
        >
          {t("cart")} {itemsQuantity ? itemsQuantity : ""}
        </Button>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="fixed inset-0 z-10 h-screen bg-overlay" />
          <ModalTransition
            isOpen={open}
            contentClassName="fixed inset-x-2.5 bottom-auto top-2 z-50 flex max-h-[calc(100vh-5px)] flex-col overflow-hidden bg-bgColor px-2.5 pb-2.5 pt-4 text-textColor lg:hidden"
            contentSlideFrom="top"
            content={
              <DialogPrimitives.Content className="flex h-full min-h-0 flex-col">
                <DialogPrimitives.Title
                  id="mobile-cart-title"
                  className="sr-only"
                >
                  {tAccessibility("mobile menu")}
                </DialogPrimitives.Title>
                <div
                  className={cn(
                    "relative mb-10 flex shrink-0 items-center justify-between",
                    { "mb-0": itemsQuantity === 0 },
                  )}
                >
                  <Text variant="uppercase">{`${tCart("shopping cart")} ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
                  <DialogPrimitives.Close asChild>
                    <Button onClick={closeCart} className="-m-2 p-3">
                      [x]
                    </Button>
                  </DialogPrimitives.Close>
                </div>
                {itemsQuantity > 0 ? (
                  <>
                    <div className="no-scroll-bar min-h-0 flex-1 overflow-y-auto">
                      <CartProductsList />
                    </div>
                    <div className="mt-auto shrink-0 space-y-6 pt-6">
                      <CartTotalPrice />
                      <Button
                        asChild
                        variant="main"
                        size="lg"
                        className="w-full uppercase"
                      >
                        <Link
                          href="/checkout"
                          prefetch
                          onClick={() => {
                            handleBeginCheckoutEvent();
                            closeCart();
                          }}
                        >
                          {tCart("proceed to checkout")}
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-[33.333vh] items-center justify-center">
                    <Text variant="uppercase">{tCart("empty")}</Text>
                  </div>
                )}
              </DialogPrimitives.Content>
            }
          />
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
    </>
  );
}

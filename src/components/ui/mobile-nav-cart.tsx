"use client";

import Link from "next/link";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import CartProductsList from "@/app/[locale]/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/[locale]/(checkout)/cart/_components/CartTotalPrice";

import { Button } from "./button";
import { Text } from "./text";

export function MobileNavCart({
  isProductInfo = false,
}: {
  isProductInfo?: boolean;
}) {
  const { products, isOpen, openCart, closeCart } = useCart((state) => state);
  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const open = isMobile && isOpen;
  const t = useTranslations("navigation");
  const tCart = useTranslations("cart");

  return (
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
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-textColor" />
        <DialogPrimitives.Content
          className={cn(
            "blackTheme fixed left-0 z-50 w-screen bg-bgColor p-2.5 text-textColor lg:hidden",
            {
              "inset-y-0 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]":
                itemsQuantity > 0,
              "bottom-0 pb-[env(safe-area-inset-bottom)]": itemsQuantity === 0,
            },
          )}
        >
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex h-full flex-col justify-between">
            <div
              className={cn(
                "relative mb-10 flex items-center justify-between",
                {
                  "mb-10": itemsQuantity === 0,
                },
              )}
            >
              <Text variant="uppercase">{`${tCart("shopping cart")} ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
              <DialogPrimitives.Close asChild>
                <Button onClick={closeCart}>[x]</Button>
              </DialogPrimitives.Close>
            </div>

            {itemsQuantity > 0 ? (
              <>
                <div className="no-scroll-bar h-full overflow-y-scroll">
                  <CartProductsList />
                </div>
                <div className="mt-auto space-y-6">
                  <CartTotalPrice />
                  <Button
                    asChild
                    variant="main"
                    size="lg"
                    className="w-full uppercase"
                  >
                    <Link href="/checkout">{tCart("proceed to checkout")}</Link>
                  </Button>
                </div>
              </>
            ) : (
              <Text variant="uppercase">{tCart("empty")}</Text>
            )}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

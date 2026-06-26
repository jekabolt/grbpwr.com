"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useCart } from "@/lib/stores/cart/store-provider";
import { ModalTransition } from "@/components/modal-transition";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { products, isOpen, closeCart } = useCart((state) => state);

  const t = useTranslations("cart");
  const tAccessibility = useTranslations("accessibility");

  // Gate on desktop so the portaled content never co-opens with the mobile cart
  // dialog (both read the same store `isOpen`).
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const open = isDesktop && isOpen;

  const itemsQuantity = products.length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  useEffect(() => {
    if (open && products.length > 0) {
      router.prefetch("/checkout");
    }
  }, [open, products.length, router]);

  return (
    <DialogPrimitives.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) closeCart();
      }}
    >
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-30 bg-overlay" />
        <ModalTransition
          isOpen={open}
          contentClassName="fixed inset-y-2 right-2 z-30 w-[500px] border border-textInactiveColor bg-bgColor p-2.5 text-textColor"
          contentSlideFrom="right"
          content={
            <DialogPrimitives.Content className="flex h-full min-h-0 flex-col gap-y-6">
              <DialogPrimitives.Title className="sr-only">
                {t("shopping cart")}
              </DialogPrimitives.Title>
              <div className="flex items-center justify-between">
                <Text variant="uppercase">{`${t("shopping cart")} ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
                <DialogPrimitives.Close asChild>
                  <Button
                    aria-label={tAccessibility("close cart")}
                    className="flex min-h-11 min-w-11 items-center justify-center"
                  >
                    [x]
                  </Button>
                </DialogPrimitives.Close>
              </div>
              {!itemsQuantity ? (
                <div className="flex h-full items-center justify-center">
                  <Text variant="uppercase">{t("empty")}</Text>
                </div>
              ) : (
                <>{children}</>
              )}
              {itemsQuantity > 0 && (
                <Button
                  asChild
                  variant="main"
                  size="lg"
                  className="block w-full uppercase"
                >
                  <Link href="/checkout" prefetch>
                    {t("proceed to checkout")}
                  </Link>
                </Button>
              )}
            </DialogPrimitives.Content>
          }
        />
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

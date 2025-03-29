import Link from "next/link";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import CartProductsList from "@/app/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/(checkout)/cart/_components/CartTotalPrice";

import { Button } from "./button";
import { Text } from "./text";

export function MobileNavCart() {
  const { products, isOpen, closeCart, openCart } = useCart((state) => state);
  const itemsQuantity = Object.keys(products).length;
  const cartCount = itemsQuantity.toString().padStart(2, "0");

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const open = isMobile && isOpen;

  return (
    <DialogPrimitives.Root open={open} onOpenChange={closeCart}>
      <Button
        onClick={openCart}
        size="lg"
        variant="simpleReverse"
        className="w-full bg-transparent"
      >
        cart {itemsQuantity ? itemsQuantity : ""}
      </Button>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-overlay" />
        <DialogPrimitives.Content
          className={cn("fixed left-0 z-30 w-screen bg-bgColor p-2.5", {
            "inset-y-0 py-5": itemsQuantity > 0,
            "bottom-0": itemsQuantity === 0,
          })}
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
              <Text variant="uppercase">{`shopping cart ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
              <DialogPrimitives.Close asChild>
                <Button>[X]</Button>
              </DialogPrimitives.Close>
            </div>

            {itemsQuantity > 0 ? (
              <>
                <div className="no-scroll-bar h-full overflow-y-scroll">
                  <CartProductsList />
                </div>
                <div className="mt-auto space-y-6">
                  <CartTotalPrice />
                  <DialogPrimitives.Close asChild>
                    <Button
                      asChild
                      variant="main"
                      size="lg"
                      className="w-full uppercase"
                    >
                      <Link href="/checkout">proceed to checkout</Link>
                    </Button>
                  </DialogPrimitives.Close>
                </div>
              </>
            ) : (
              <Text variant="uppercase">empty</Text>
            )}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

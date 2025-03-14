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
      <Button onClick={openCart} size="sm" variant="simpleReverse">
        cart {itemsQuantity ? itemsQuantity : ""}
      </Button>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-10 bg-overlay" />
        <DialogPrimitives.Content
          className={cn(
            "fixed left-0 z-30 flex w-screen flex-col bg-bgColor p-2.5",
            {
              "top-0 h-screen pt-5": itemsQuantity > 0,
              "bottom-0": itemsQuantity === 0,
            },
          )}
        >
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div
            className={cn("relative mb-16 flex items-center justify-between", {
              "mb-10": itemsQuantity === 0,
            })}
          >
            <Text variant="uppercase">{`shopping cart ${itemsQuantity ? `[${cartCount}]` : ""}`}</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
            </DialogPrimitives.Close>
          </div>

          {itemsQuantity > 0 ? (
            <>
              <div className="relative grow overflow-y-auto">
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
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

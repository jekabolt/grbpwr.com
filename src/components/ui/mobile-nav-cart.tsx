import Link from "next/link";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { useCart } from "@/lib/stores/cart/store-provider";
import CartProductsList from "@/app/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/(checkout)/cart/_components/CartTotalPrice";

import { Button } from "./button";
import { Text } from "./text";

export function MobileNavCart() {
  const products = useCart((state) => state.products);
  const itemsQuantity = Object.keys(products).length;
  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <Button variant="main">
          cart {itemsQuantity ? `[${itemsQuantity}]` : ""}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-textColor" />
        <DialogPrimitives.Content className="blackTheme fixed left-0 top-0 z-20 flex h-screen w-screen flex-col p-2.5 ">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-[64px] flex items-center justify-between">
            <Text variant="uppercase">
              shopping Cart [{itemsQuantity?.toString().padStart(2, "0")}]
            </Text>
            <DialogPrimitives.Close asChild>
              <Button className="bg-black text-textColor">[X]</Button>
            </DialogPrimitives.Close>
          </div>

          <div className="relative grow overflow-y-auto">
            <CartProductsList />
          </div>

          <div className="mt-auto space-y-6 border-t border-dashed border-textInactiveColor pt-4">
            <CartTotalPrice />
            <DialogPrimitives.Close asChild>
              <Button
                asChild
                variant="main"
                size="lg"
                className="w-full uppercase"
              >
                <Link href="/checkout">go to checkout</Link>
              </Button>
            </DialogPrimitives.Close>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

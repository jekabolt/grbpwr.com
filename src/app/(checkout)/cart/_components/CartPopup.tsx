"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useClickAway } from "@uidotdev/usehooks";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

export default function CartPopup({ children }: { children: React.ReactNode }) {
  const products = useCart((state) => state.products);
  const itemsQuantity = Object.keys(products).length;
  const [open, setOpenStatus] = useState(false);

  useEffect(() => {
    const handleEscClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenStatus(false);
      }
    };

    document.addEventListener("keydown", handleEscClick);

    return () => {
      document.removeEventListener("keydown", handleEscClick);
    };
  }, []);

  const ref = useClickAway<HTMLDivElement>(() => {
    setOpenStatus(false);
  });

  return (
    <>
      <div className="block lg:hidden">
        <MobileNavCart />
      </div>
      <div className="relative hidden lg:block" ref={ref}>
        <Button
          onClick={() => setOpenStatus((v) => !v)}
          variant={open ? "underline" : "default"}
          size="sm"
          className="underline-offset-2 hover:underline"
        >
          cart {itemsQuantity ? itemsQuantity : ""}
        </Button>
        <div>
          <div
            className={cn(
              "absolute right-0 top-10 z-30 hidden w-[500px] space-y-6 bg-bgColor p-2.5",
              {
                block: open,
              },
            )}
          >
            {children}
            <Button
              asChild
              variant="main"
              size="lg"
              className="block w-full uppercase"
            >
              <Link href="/checkout">proceed to checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

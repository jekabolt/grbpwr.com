"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClickAway } from "@uidotdev/usehooks";
import Link from "next/link";
import { useState } from "react";

export default function CartPopup({
  children,
  itemsQuantity,
}: {
  children: React.ReactNode;
  itemsQuantity?: number;
}) {
  const [open, setOpenStatus] = useState(false);

  const ref = useClickAway<HTMLDivElement>(() => {
    setOpenStatus(false);
  });

  return (
    <div className="group relative" ref={ref}>
      <Button
        onClick={() => setOpenStatus((v) => !v)}
        variant="underlineWithColors"
      >
        cart {itemsQuantity ? `(${itemsQuantity})` : ""}
      </Button>
      <div className="blueTheme">
        <div
          className={cn(
            "absolute -top-1 right-0 z-30 hidden w-[500px] space-y-6 bg-bgColor p-2.5",
            {
              block: open,
            },
          )}
        >
          <div className="flex justify-between text-textColor">
            <div className="flex gap-2">
              <div>SHOPPING CART</div>
              <span>[{itemsQuantity?.toString().padStart(2, "0")}]</span>
            </div>
            <Button onClick={() => setOpenStatus((v) => !v)}>[X]</Button>
          </div>
          {children}
          <Button
            asChild
            variant="main"
            size="lg"
            className="block w-full"
          >
            <Link href="/cart/checkout">PROCEED TO CHECKOUT</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

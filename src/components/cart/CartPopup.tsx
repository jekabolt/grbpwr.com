"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useClickAway } from "@uidotdev/usehooks";
import Link from "next/link";
import { useState } from "react";
import { ButtonStyle } from "../ui/Button/styles";

export default function CartPopup({
  children,
  itemsQuantity,
  hasCartProducts,
}: {
  children: React.ReactNode;
  itemsQuantity?: number;
  hasCartProducts?: boolean;
}) {
  const [open, setOpenStatus] = useState(false);

  const ref = useClickAway<HTMLDivElement>(() => {
    setOpenStatus(false);
  });

  return (
    <div>
      <div className="group relative" ref={ref}>
        <Button
          onClick={() => setOpenStatus(!open)}
          style={ButtonStyle.underlinedHightlightButton}
        >
          cart {itemsQuantity ? `(${itemsQuantity})` : ""}
        </Button>
        <div className="blueTheme">
          <div
            className={cn(
              "absolute -top-1 right-0 z-30 hidden w-[500px] bg-bgColor p-5",
              {
                block: open,
              },
            )}
          >
            <div className="mb-6 text-textColor">added to cart {"[06]"}</div>
            {children}
            <div className="flex justify-end gap-2">
              <Button asChild style={ButtonStyle.simpleButton}>
                <Link href="/cart">cart</Link>
              </Button>
              {hasCartProducts && (
                <Button asChild style={ButtonStyle.simpleButton}>
                  <Link href="/cart/checkout">checkout</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

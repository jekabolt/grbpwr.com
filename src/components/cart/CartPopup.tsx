"use client";

import { useState } from "react";
import Link from "next/link";
import { useClickAway } from "@uidotdev/usehooks";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ButtonStyle } from "../ui/Button/styles";

export default function CartPopup({
  children,
  itemsQuanity,
}: {
  children: React.ReactNode;
  itemsQuanity?: number;
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
          style={ButtonStyle.underlinedButton}
        >
          cart {itemsQuanity ? `(${itemsQuanity})` : ""}
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
              <Button asChild style={ButtonStyle.simpleButton}>
                <Link href="/cart/checkout">checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

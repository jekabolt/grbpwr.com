"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { ButtonStyle } from "../ui/Button/styles";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useClickAway } from "@uidotdev/usehooks";

export default function CartPopup({ children }: { children: React.ReactNode }) {
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
          cart
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
            <div className="relative">
              <div className="no-scroll-bar relative max-h-[800px] space-y-5 overflow-y-scroll pb-5">
                {children}
              </div>
              <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-bgColor"></div>
            </div>
            <div className="mb-3 flex justify-between border-t border-dashed border-textColor pt-5 text-textColor">
              <span>total:</span>
              <span>170$</span>
            </div>
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

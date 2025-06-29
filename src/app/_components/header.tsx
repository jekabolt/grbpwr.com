"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";

import CartPopup from "../(checkout)/cart/_components/CartPopup";
import CartProductsList from "../(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "../(checkout)/cart/_components/CartTotalPrice";
import { HeaderLeftNav } from "./header-left-nav";

export function Header({
  mode = "default",
}: {
  mode?: "inverted" | "default" | "transparent";
}) {
  const { dictionary } = useDataContext();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isBigMenuEnabled = dictionary?.bigMenu;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 bottom-2 z-30 flex h-12 items-center justify-between gap-1 border-textInactiveColor py-2 lg:top-2 lg:gap-0 lg:border lg:border-transparent lg:px-5 lg:py-3",
        {
          "bg-bgColor text-textColor mix-blend-exclusion": mode === "inverted",
          "lg:bg-transparent lg:text-bgColor":
            mode === "inverted" && isScrolled && !isNavOpen,
          // (mode === "transparent" && isScrolled && !isNavOpen),
          "bg-textColor text-bgColor mix-blend-hard-light lg:bg-transparent lg:mix-blend-exclusion":
            mode === "transparent",
          "bg-bgColor text-textColor mix-blend-normal":
            mode === "transparent" && isNavOpen,
          "lg:border-x lg:border-t lg:border-textInactiveColor": isNavOpen,
          "border-none": !isBigMenuEnabled,
        },
      )}
    >
      <HeaderLeftNav
        isNavOpen={isNavOpen}
        onNavOpenChange={setIsNavOpen}
        isBigMenuEnabled={isBigMenuEnabled}
      />

      <Button asChild size="lg" className="w-1/3 text-center lg:w-auto">
        <Link href="/">grbpwr</Link>
      </Button>

      <div className="flex grow basis-0 items-center justify-end">
        <CartPopup>
          <div className="h-full overflow-y-scroll">
            <CartProductsList />
          </div>
          <CartTotalPrice />
        </CartPopup>
      </div>
    </header>
  );
}

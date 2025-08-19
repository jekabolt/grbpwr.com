"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { HeaderProps } from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";

export function AdditionalHeader({
  left,
  center,
  right,
  hidden = false,
}: HeaderProps) {
  const router = useRouter();
  const { openCart } = useCart((s) => s);

  const handleLeftClick = () => {
    openCart();
    router.push("/");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-2.5 top-2 z-30 h-12 py-2 lg:gap-0 lg:px-5 lg:py-3",
        "flex items-center justify-between gap-1",
        "blackTheme bg-transparent text-textColor mix-blend-exclusion",
      )}
    >
      <Button onClick={handleLeftClick}>{left}</Button>
      <div className="flex-none text-center text-textBaseSize">{center}</div>
      <Button asChild className="hidden lg:block">
        <Link href="/">{right}</Link>
      </Button>
      <Button
        asChild
        className={cn("block lg:hidden", {
          hidden: hidden,
        })}
      >
        <Link href="/">[x]</Link>
      </Button>
    </header>
  );
}

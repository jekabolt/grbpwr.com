import Link from "next/link";

import { HeaderProps } from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

// TODO: make so that this component reuses same props as desktop (headerAdditionalProps)
// сейчас здесь захардкожен тип каталог надо сделать чтобы был флексибл
export function MobileProductInfoHeader({ left, link }: HeaderProps) {
  return (
    <header className="fixed inset-x-2.5 top-2.5 z-10 flex items-center justify-between">
      <Button asChild className="w-1/3 py-2.5 pl-2.5 text-left">
        <Link href={link || ""}>{left}</Link>
      </Button>
      <MobileNavCart isProductInfo />
    </header>
  );
}

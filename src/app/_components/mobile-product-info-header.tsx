import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";
import { MobileNavCart } from "@/components/ui/mobile-nav-cart";

export function MobileProductInfoHeader({ left, link }: HeaderProps) {
  return (
    <header className="fixed inset-x-2.5 top-2.5 z-10 flex items-center justify-between">
      <AnimatedButton href={link}>{left}</AnimatedButton>
      <MobileNavCart isProductInfo />
    </header>
  );
}

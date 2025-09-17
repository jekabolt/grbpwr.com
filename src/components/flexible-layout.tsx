"use client";

import { cn } from "@/lib/utils";
import { AdditionalHeader } from "@/app/[locale]/_components/additional-header";
import { Footer } from "@/app/[locale]/_components/footer";
import { Header } from "@/app/[locale]/_components/header";
import { HeaderArchive } from "@/app/[locale]/_components/header-archive";
import { MobileProductInfoHeader } from "@/app/[locale]/_components/mobile-product-info-header";
import CartPopup from "@/app/[locale]/(checkout)/cart/_components/CartPopup";
import CartProductsList from "@/app/[locale]/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/[locale]/(checkout)/cart/_components/CartTotalPrice";

export default function FlexibleLayout({
  children,
  headerType = "main",
  headerProps,
  mobileHeaderType,
  theme,
  className,
  displayFooter = true,
}: Props) {
  return (
    <div
      className={cn("bg-bgColor", {
        blackTheme: theme === "dark",
      })}
    >
      <div className={cn("relative min-h-screen", className)}>
        {mobileHeaderType === "flexible" && (
          <div className="block lg:hidden">
            <MobileProductInfoHeader {...headerProps} />
          </div>
        )}
        {headerType === "flexible" && (
          <div className="block">
            <AdditionalHeader {...headerProps} />
          </div>
        )}
        {(headerType === "catalog" || headerType === "main") && (
          <div className={mobileHeaderType ? "hidden lg:block" : ""}>
            <Header isCatalog={headerType === "catalog"} />
          </div>
        )}
        {headerType === "archive" && <HeaderArchive {...headerProps} />}
        <div className="w-full">{children}</div>
      </div>
      {displayFooter && <Footer theme={theme} />}
      {(headerType === "catalog" || headerType === "main") && (
        <CartPopup>
          <div className="h-full overflow-y-scroll">
            <CartProductsList />
          </div>
          <CartTotalPrice />
        </CartPopup>
      )}
    </div>
  );
}

type Props = {
  children: React.ReactNode;
  headerType?: "main" | "catalog" | "flexible" | "archive";
  mobileHeaderType?: "flexible";
  headerProps?: HeaderProps;
  theme?: "light" | "dark";
  className?: string;
  displayFooter?: boolean;
};

export type HeaderProps = {
  left?: string;
  center?: string;
  right?: string;
  link?: string;
  hidden?: boolean;
  onClick?: () => void;
};

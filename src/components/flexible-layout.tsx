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
  showAnnounce = false,
  accountPanel = false,
  fillViewport = false,
}: Props) {
  return (
    <div
      className={cn("bg-bgColor", {
        blackTheme: theme === "dark",
      })}
    >
      <div className={cn("relative min-h-dvh", className)}>
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
            <Header showAnnounce={showAnnounce} theme={theme} />
          </div>
        )}
        {headerType === "archive" && <HeaderArchive {...headerProps} />}
        <div
          className={cn("w-full", fillViewport && "h-full min-h-0")}
        >
          {children}
        </div>
      </div>
      {displayFooter && <Footer theme={theme} accountPanel={accountPanel} />}
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
  showAnnounce?: boolean;
  accountPanel?: boolean;
  /** Pass true when page content must fill a fixed viewport height (e.g. account). */
  fillViewport?: boolean;
};

export type HeaderProps = {
  left?: string;
  center?: string;
  right?: string;
  link?: string;
  hidden?: boolean;
  leftNav?: "default" | "home";
  onClick?: () => void;
};

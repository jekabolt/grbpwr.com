"use client";

import { cn } from "@/lib/utils";
import { AdditionalHeader } from "@/app/_components/additional-header";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { HeaderArchive } from "@/app/_components/header-archive";
import { MiniFooter } from "@/app/_components/mini-footer";
import { MobileProductInfoHeader } from "@/app/_components/mobile-product-info-header";

export default function FlexibleLayout({
  children,
  headerType = "catalog",
  headerProps,
  mobileHeaderType,
  // mobileHeaderProps,
  footerType = "regular",
  theme = "light",
  className,
  transparent,
}: Props) {
  return (
    <div
      className={cn(
        "text-color relative min-h-screen bg-bgColor",
        {
          blackTheme: theme === "dark",
        },
        className,
      )}
    >
      {mobileHeaderType === "flexible" && (
        <div className="block lg:hidden">
          <MobileProductInfoHeader {...headerProps} />
        </div>
      )}
      {headerType === "archive" && <HeaderArchive {...headerProps} />}
      {headerType === "flexible" && <AdditionalHeader {...headerProps} />}
      {headerType === "catalog" && (
        <div className={mobileHeaderType ? "hidden lg:block" : ""}>
          <Header transparent={transparent} />
        </div>
      )}

      <div className="w-full">{children}</div>

      {footerType === "mini" && <MiniFooter theme={theme} />}
      {footerType === "regular" && <Footer />}
    </div>
  );
}

type Props = {
  children: React.ReactNode;
  headerType?: "catalog" | "flexible" | "archive";
  transparent?: boolean;
  mobileHeaderType?: "flexible";
  headerProps?: HeaderProps;
  mobileHeaderProps?: {
    className?: string;
  };
  footerType?: "mini" | "regular";
  theme?: "light" | "dark";
  className?: string;
};

export interface HeaderProps {
  left?: string;
  center?: string;
  right?: string;
  link?: string;
  onClick?: () => void;
}

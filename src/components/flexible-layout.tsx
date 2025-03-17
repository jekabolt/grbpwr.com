import { cn } from "@/lib/utils";
import { AdditionalHeader } from "@/app/_components/additional-header";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { MiniFooter } from "@/app/_components/mini-footer";
import { MobileProductInfoHeader } from "@/app/_components/mobile-product-info-header";

export default function FlexibleLayout({
  children,
  headerType,
  headerProps,
  mobileHeaderType,
  footerType,
  theme,
  className,
  transparent,
}: Props) {
  return (
    <div className={cn("relative min-h-screen bg-bgColor", className)}>
      {mobileHeaderType === "flexible" && (
        <div className="block lg:hidden">
          <MobileProductInfoHeader />
        </div>
      )}
      {headerType === "flexible" && (
        <div className="hidden lg:block">
          <AdditionalHeader {...headerProps} />
        </div>
      )}
      {headerType === "catalog" && (
        <div className={mobileHeaderType ? "hidden lg:block" : ""}>
          <Header transparent={transparent} />
        </div>
      )}

      <div className="w-full space-y-32">{children}</div>

      {footerType === "mini" && <MiniFooter theme={theme} />}
      {footerType === "regular" && <Footer />}
    </div>
  );
}

type Props = {
  children: React.ReactNode;
  headerType?: "catalog" | "flexible";
  transparent?: boolean;
  mobileHeaderType?: "flexible";
  headerProps?: {
    left?: string;
    center?: string;
    right?: string;
    link?: string;
  };
  footerType?: "mini" | "regular";
  theme?: "light" | "dark";
  className?: string;
};

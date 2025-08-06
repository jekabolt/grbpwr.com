import { cn } from "@/lib/utils";
import { AdditionalHeader } from "@/app/_components/additional-header";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { HeaderArchive } from "@/app/_components/header-archive";
import { MobileProductInfoHeader } from "@/app/_components/mobile-product-info-header";
import CartPopup from "@/app/(checkout)/cart/_components/CartPopup";
import CartProductsList from "@/app/(checkout)/cart/_components/CartProductsList";
import CartTotalPrice from "@/app/(checkout)/cart/_components/CartTotalPrice";

export default function FlexibleLayout({
  children,
  headerType = "catalog",
  headerProps,
  mobileHeaderType,
  theme,
  className,
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
            <MobileProductInfoHeader />
          </div>
        )}
        {headerType === "flexible" && (
          <div className="block">
            <AdditionalHeader {...headerProps} />
          </div>
        )}
        {headerType === "catalog" && (
          <div className={mobileHeaderType ? "hidden lg:block" : ""}>
            <Header />
          </div>
        )}
        {headerType === "archive" && <HeaderArchive {...headerProps} />}
        <div className="w-full">{children}</div>
      </div>
      <Footer theme={theme} />
      {headerType === "catalog" && (
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
  headerType?: "catalog" | "flexible" | "archive";
  mobileHeaderType?: "flexible";
  headerProps?: HeaderProps;
  theme?: "light" | "dark";
  className?: string;
};

export type HeaderProps = {
  left?: string;
  center?: string;
  right?: string;
  link?: string;
  hidden?: boolean;
  onClick?: () => void;
};

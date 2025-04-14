import { cn } from "@/lib/utils";
import { AdditionalHeader } from "@/app/_components/additional-header";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { HeaderArchive } from "@/app/_components/header-archive";
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
    <div
      className={cn(
        "relative min-h-screen bg-bgColor",
        {
          blackTheme: theme === "dark",
        },
        className,
      )}
    >
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
          <Header transparent={transparent} />
        </div>
      )}
      {headerType === "archive" && <HeaderArchive {...headerProps} />}

      <div className="w-full">{children}</div>

      {footerType === "mini" && (
        <MiniFooter theme={theme} className="bg-bgColor text-textColor" />
      )}
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
  footerType?: "mini" | "regular";
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

import { cn } from "@/lib/utils";
import { AdditionalHeader } from "@/app/_components/additional-header";
import { Footer } from "@/app/_components/footer";
import { Header } from "@/app/_components/header";
import { MiniFooter } from "@/app/_components/mini-footer";

export default function FlexibleLayout({
  children,
  headerType,
  headerProps,
  footerType,
  theme,
  className,
}: Props) {
  return (
    <div className={cn("relative min-h-screen bg-bgColor", className)}>
      {headerType === "flexible" && <AdditionalHeader {...headerProps} />}
      {headerType === "catalog" && <Header />}
      <div className="w-full space-y-32">{children}</div>
      {footerType === "mini" && <MiniFooter theme={theme} />}
      {footerType === "regular" && <Footer />}
    </div>
  );
}

type Props = {
  children: React.ReactNode;
  headerType?: "catalog" | "flexible";
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

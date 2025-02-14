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
}: Readonly<{
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
}>) {
  return (
    <div className="relative min-h-screen bg-bgColor">
      {headerType === "flexible" && <AdditionalHeader {...headerProps} />}
      {headerType === "catalog" && <Header />}
      <div className="w-full">{children}</div>
      {footerType === "mini" && <MiniFooter theme={theme} />}
      {footerType === "regular" && <Footer />}
    </div>
  );
}

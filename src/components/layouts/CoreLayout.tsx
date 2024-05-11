import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import Link from "@/components/global/Link";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-bgColor">
      <div className="mx-auto max-w-7xl">
        <Header />
        <div className="flex">
          <div className="relative hidden w-24 md:block">
            <div className="sticky top-24 flex flex-col items-center gap-60">
              <Link style="mainNavigation" title="Catalog" href="/catalog" />
              <Link style="mainNavigation" title="Archive" href="/archive" />
              <Link style="mainNavigation" title="Shipping" href="/shipping" />
            </div>
          </div>

          <div className="w-full space-y-20 px-2 md:px-0 lg:w-[calc(100%-192px)]">
            {children}
          </div>

          <div className="relative hidden w-24 md:block">
            <div className="sticky top-24 flex flex-col items-center gap-60">
              <Link style="mainNavigation" title="Cart" href="/cart" />
              <Link style="mainNavigation" title="About" href="/about" />
              <Link style="mainNavigation" title="Contacts" href="/contacts" />
            </div>
          </div>
        </div>
        <Footer className="mt-24" />
      </div>
    </div>
  );
}

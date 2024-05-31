import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import Link from "@/components/global/Link";
import { LinkStyle } from "@/components/global/Link/styles";
import HoverCart from "@/components/cart/HoverCart";

export default function CoreLayout({
  children,
  hideForm,
}: Readonly<{
  children: React.ReactNode;
  hideForm?: boolean;
}>) {
  return (
    <div className="bg-bgColor">
      <div className="relative mx-auto max-w-7xl">
        <Header />
        <div className="flex">
          <div className="relative hidden w-24 md:block">
            <nav className="sticky top-24 flex flex-col items-center gap-60">
              <Link
                style={LinkStyle.mainNavigation}
                title="catalog"
                href="/catalog"
              />
              <Link
                style={LinkStyle.mainNavigation}
                title="archive"
                href="/archive"
              />
              <Link
                style={LinkStyle.mainNavigation}
                title="shipping"
                href="/shipping"
              />
            </nav>
          </div>

          <div className="w-full space-y-20 px-2 md:px-0 lg:w-[calc(100%-192px)]">
            {children}
          </div>

          <div className="relative hidden w-24 md:block">
            <nav className="sticky top-24 flex flex-col items-center gap-60">
              <HoverCart>
                <Link
                  style={LinkStyle.mainNavigation}
                  title="cart"
                  href="/cart"
                />
              </HoverCart>
              <Link
                style={LinkStyle.mainNavigation}
                title="about"
                href="/about"
              />
              <Link
                style={LinkStyle.mainNavigation}
                title="contacts"
                href="/contacts"
              />
            </nav>
          </div>
        </div>
        <Footer className="mt-24" hideForm={hideForm} />
      </div>
    </div>
  );
}

import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import GlobalLink from "@/components/global/Link";
import { LinkStyle } from "@/components/global/Link/styles";
import HoverCart from "@/components/cart/HoverCart";
import { Suspense } from "react";

export default function CoreLayout({
  children,
  hideForm,
}: Readonly<{
  children: React.ReactNode;
  hideForm?: boolean;
}>) {
  return (
    <div className="min-h-screen bg-bgColor">
      <div className="relative mx-auto max-w-7xl">
        <Header />
        <div className="flex">
          <div className="relative hidden w-24 md:block">
            <nav className="sticky top-24 flex flex-col items-center gap-60">
              <GlobalLink style={LinkStyle.mainNavigation} href="/catalog">
                catalog
              </GlobalLink>
              <GlobalLink style={LinkStyle.mainNavigation} href="/archive">
                archive
              </GlobalLink>
              <GlobalLink style={LinkStyle.mainNavigation} href="/shipping">
                shipping
              </GlobalLink>
            </nav>
          </div>

          <div className="w-full space-y-20 px-2 md:px-0 lg:w-[calc(100%-192px)]">
            {children}
          </div>

          <div className="relative hidden w-24 md:block">
            <nav className="sticky top-24 flex flex-col items-center gap-60">
              <Suspense
                fallback={
                  <GlobalLink style={LinkStyle.mainNavigation} href="/cart">
                    cart
                  </GlobalLink>
                }
              >
                <HoverCart>
                  <GlobalLink style={LinkStyle.mainNavigation} href="/cart">
                    cart
                  </GlobalLink>
                </HoverCart>
              </Suspense>
              <GlobalLink style={LinkStyle.mainNavigation} href="/about">
                about
              </GlobalLink>
              <GlobalLink style={LinkStyle.mainNavigation} href="/contacts">
                contacts
              </GlobalLink>
            </nav>
          </div>
        </div>
        <Footer className="mt-24" hideForm={hideForm} />
      </div>
    </div>
  );
}

import CartPopup from "@/components/cart/CartPopup";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import Link from "next/link";
import { Suspense } from "react";
import CartProductsList from "../cart/CartProductsList";
import TotalPrice from "../cart/TotalPrice";
import { getCookieCart } from "@/lib/utils/cart";

export default function CoreLayout({
  children,
  hideForm,
}: Readonly<{
  children: React.ReactNode;
  hideForm?: boolean;
}>) {
  const cartData = getCookieCart();
  const hasCartProducts =
    cartData?.products && Object.keys(cartData?.products).length > 0;
  const productsNumber = Object.keys(cartData?.products || {}).length;

  return (
    <div className="min-h-screen bg-bgColor">
      <div className="relative mx-auto max-w-7xl">
        <Header />
        <div className="flex">
          <div className="relative hidden w-24 md:block">
            <nav className="sticky top-24 flex flex-col items-center gap-60">
              <Button style={ButtonStyle.underlinedHightlightButton}>
                <Link href="/catalog">catalog</Link>
              </Button>
              <Button style={ButtonStyle.underlinedHightlightButton}>
                <Link href="/archive">archive</Link>
              </Button>
              <Button style={ButtonStyle.underlinedHightlightButton}>
                <Link href="/shipping">shipping</Link>
              </Button>
            </nav>
          </div>

          <div className="w-full space-y-20 px-2 md:px-0 lg:w-[calc(100%-192px)]">
            {children}
          </div>

          <div className="relative hidden w-24 md:block">
            <nav className="sticky top-24 flex flex-col items-center gap-60">
              <CartPopup
                itemsQuantity={productsNumber}
                hasCartProducts={hasCartProducts}
              >
                <Suspense fallback={null}>
                  <div className="relative">
                    <div className="no-scroll-bar relative max-h-[500px] space-y-5 overflow-y-scroll pb-5">
                      <CartProductsList />
                    </div>

                    {/* when cursor is in gradient area-scroll doesnt work */}
                    <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-bgColor"></div>
                  </div>
                  <div className="mb-3 flex justify-between border-t border-dashed border-textColor pt-5 text-textColor">
                    <TotalPrice />
                  </div>
                </Suspense>
              </CartPopup>
              <Button style={ButtonStyle.underlinedHightlightButton}>
                <Link href="/about">about</Link>
              </Button>
              <Button style={ButtonStyle.underlinedHightlightButton}>
                <Link href="/contacts">contacts</Link>
              </Button>
            </nav>
          </div>
        </div>
        <Footer className="mt-24" hideForm={hideForm} />
      </div>
    </div>
  );
}

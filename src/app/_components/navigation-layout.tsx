import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import CartPopup from "@/app/(checkout)/cart/_components/CartPopup";
import CartProductsList from "@/app/(checkout)/cart/_components/CartProductsList";

import { Footer } from "./footer";
import { Header } from "./header";

export default async function NavigationLayout({
  children,
  hideForm,
}: Readonly<{
  children: React.ReactNode;
  hideForm?: boolean;
}>) {
  return (
    <div className="min-h-screen bg-bgColor">
      <Header />
      <div className="flex">
        <div className="relative hidden w-24 md:block">
          <nav className="sticky top-24 flex flex-col items-center gap-60">
            <Button variant="underlineWithColors" asChild>
              <Link href="/catalog">catalog</Link>
            </Button>
            <Button variant="underlineWithColors" asChild>
              <Link href="/archive">archive</Link>
            </Button>
            <Button variant="underlineWithColors" asChild>
              <Link href="/shipping">shipping</Link>
            </Button>
          </nav>
        </div>

        <div className="w-full space-y-20 px-2 md:px-0 lg:w-[calc(100%-192px)]">
          {children}
        </div>

        <div className="relative hidden w-24 md:block">
          <nav className="sticky top-24 flex flex-col items-center gap-60">
            <CartPopup>
              <Suspense fallback={null}>
                <div className="no-scroll-bar relative max-h-[500px] space-y-5 overflow-y-scroll">
                  <CartProductsList className="border-b border-dashed border-textColor pb-6" />
                </div>
              </Suspense>
            </CartPopup>
            <Button variant="underlineWithColors" asChild>
              <Link href="/about">about</Link>
            </Button>
            <Button variant="underlineWithColors" asChild>
              <Link href="/contacts">contacts</Link>
            </Button>
          </nav>
        </div>
      </div>
      <Footer className="mt-24" hideForm={hideForm} />
    </div>
  );
}

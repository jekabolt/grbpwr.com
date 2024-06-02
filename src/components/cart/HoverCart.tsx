import GlobalLink from "@/components/global/Link";
import CartProductsList from "./CartProductsList";
import { Suspense } from "react";

export default function HoverCart({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="group relative">
        {children}
        <div className="blueTheme">
          <div className="absolute -top-1 right-0 z-30 hidden w-[500px] bg-bgColor p-5 group-hover:block">
            <div className="mb-6 text-textColor">added to cart {"[06]"}</div>
            <div className="relative">
              <div className="no-scroll-bar relative max-h-[800px] space-y-5 overflow-y-scroll pb-5">
                <Suspense fallback={null}>
                  <CartProductsList />
                </Suspense>
              </div>
              <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-bgColor"></div>
            </div>
            <div className="mb-3 flex justify-between border-t border-dashed border-textColor pt-5 text-textColor">
              <span>total:</span>
              <span>170$</span>
            </div>
            <div className="flex justify-end">
              {/* todo: make it global link style */}
              <GlobalLink
                href="/cart"
                className="block w-44 bg-textColor py-2 text-center text-sm text-bgColor"
              >
                checkout
              </GlobalLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

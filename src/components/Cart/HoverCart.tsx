// todo: make it global link style
import NextLink from "next/link";
import CartItemRow from "./CartItemRow";

export default function HoverCart({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="group relative">
        {children}
        <div className="blueTheme">
          <div className="absolute -top-1 right-0 z-30 hidden w-[500px] bg-bgColor p-5 group-hover:block">
            <div className="mb-6 text-textColor">added to cart {"[06]"}</div>
            <div className="relative mb-5 space-y-5 border-b border-dashed border-textColor pb-5">
              {[1, 2, 3].map((i) => (
                <CartItemRow key={i} />
              ))}
              <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-bgColor"></div>
            </div>
            <div className="mb-3 flex justify-between text-textColor">
              <span>total:</span>
              <span>170$</span>
            </div>
            <div className="flex justify-end">
              {/* todo: make it global link style */}
              <NextLink
                href="/cart"
                className="block w-44 bg-textColor py-2 text-center text-sm text-bgColor"
              >
                checkout
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// todo: make it global link style
import NextLink from "next/link";
import { getCartCookie } from "@/lib/utils/cart";
import { serviceClient } from "@/lib/api";
import CartItemRow from "./CartItemRow";
import GlobalLink from "@/components/global/Link";

export default async function HoverCart({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = getCartCookie();

  if (!cart) return <>{children}</>;

  const cartProductSlugs = Object.keys(cart);

  const productsPromises = cartProductSlugs.map((s) =>
    serviceClient.GetProduct({
      slug: s,
    }),
  );

  const products = await Promise.all(productsPromises).then((v) =>
    v.map((p) => p.product),
  );

  return (
    <div>
      <div className="group relative">
        {children}
        <div className="blueTheme">
          <div className="absolute -top-1 right-0 z-30 hidden w-[500px] bg-bgColor p-5 group-hover:block">
            <div className="mb-6 text-textColor">added to cart {"[06]"}</div>
            <div className="relative">
              <div className="no-scroll-bar relative max-h-[800px] space-y-5 overflow-y-scroll pb-5">
                {products.map((p) => (
                  <GlobalLink
                    key={p?.product?.id as number}
                    href={`/catalog/${p?.product?.slug}`}
                  >
                    <CartItemRow product={p} />
                  </GlobalLink>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-bgColor"></div>
            </div>
            <div className="mb-3 flex justify-between border-t border-dashed border-textColor pt-5 text-textColor">
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

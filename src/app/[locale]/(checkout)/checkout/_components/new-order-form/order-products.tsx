import { common_OrderItem } from "@/api/proto-http/frontend";

import CartProductsList from "@/app/[locale]/(checkout)/cart/_components/CartProductsList";

import { MobileProductsCarousel } from "./mobile-products-carousel";

export function OrderProducts({
  validatedProducts,
  currencyKey,
}: Props) {
  // Pass undefined (not []) when validation hasn't completed — CartProductsList/MobileProductsCarousel fall back to cart
  const expandedProducts = validatedProducts
    ? validatedProducts.flatMap((item) =>
        Array.from({ length: item.orderItem?.quantity || 1 }, () => ({
          ...item,
          orderItem: {
            productId: item.orderItem?.productId!,
            quantity: 1,
            sizeId: item.orderItem?.sizeId!,
          },
        })),
      )
    : undefined;

  return (
    <div>
      <div className="hidden max-h-[50vh] overflow-y-scroll lg:block">
        <CartProductsList
          hideQuantityButtons
          validatedProducts={expandedProducts}
          currencyKey={currencyKey}
        />
      </div>

      <div className="block lg:hidden">
        <MobileProductsCarousel
          validatedProducts={expandedProducts}
          currencyKey={currencyKey}
        />
      </div>
    </div>
  );
}

type Props = {
  validatedProducts?: common_OrderItem[];
  /** When provided (e.g. order confirmation), use this currency instead of user's current locale */
  currencyKey?: string;
};

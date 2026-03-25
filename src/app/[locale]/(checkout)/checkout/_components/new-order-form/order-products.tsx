import { common_OrderItem } from "@/api/proto-http/frontend";

import CartProductsList from "@/app/[locale]/(checkout)/cart/_components/CartProductsList";

import { MobileProductsCarousel } from "./mobile-products-carousel";

export function OrderProducts({
  validatedProducts,
  currencyKey,
  disabled = false,
  disableProductLinks = false,
}: Props) {
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
          disabled={disabled}
          disableProductLinks={disableProductLinks}
        />
      </div>
      <div className="block lg:hidden">
        <MobileProductsCarousel
          validatedProducts={expandedProducts}
          currencyKey={currencyKey}
          disabled={disabled}
          disableProductLinks={disableProductLinks}
        />
      </div>
    </div>
  );
}

type Props = {
  validatedProducts?: common_OrderItem[];
  currencyKey?: string;
  disabled?: boolean;
  disableProductLinks?: boolean;
};

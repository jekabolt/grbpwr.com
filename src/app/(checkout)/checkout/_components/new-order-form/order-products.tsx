import { common_OrderItem } from "@/api/proto-http/frontend";

import CartProductsList from "@/app/(checkout)/cart/_components/CartProductsList";

import { MobileProductsCarousel } from "./mobile-products-carousel";

export function OrderProducts({ validatedProducts }: Props) {
  const expandedProducts =
    validatedProducts?.flatMap((item) =>
      Array.from({ length: item.orderItem?.quantity || 1 }, () => ({
        ...item,
        orderItem: {
          productId: item.orderItem?.productId!,
          quantity: 1,
          sizeId: item.orderItem?.sizeId!,
        },
      })),
    ) || [];

  return (
    <div>
      <div className="hidden max-h-[50vh] overflow-y-scroll lg:block">
        <CartProductsList
          hideQuantityButtons
          validatedProducts={expandedProducts}
        />
      </div>

      <div className="block lg:hidden">
        <MobileProductsCarousel validatedProducts={expandedProducts} />
      </div>
    </div>
  );
}

type Props = {
  validatedProducts?: common_OrderItem[];
};

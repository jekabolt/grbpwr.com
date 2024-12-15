import { common_OrderItem } from "@/api/proto-http/frontend";

import CartProductsList from "@/app/(checkout)/cart/_components/CartProductsList";

import { MobileProductsCarousel } from "./mobile-products-carousel";

export function OrderProducts({ validatedProducts }: Props) {
  return (
    <div>
      <div className="hidden max-h-[50vh] overflow-y-scroll lg:block">
        <CartProductsList
          hideQuantityButtons
          validatedProducts={validatedProducts}
        />
      </div>

      <div className="block lg:hidden">
        <MobileProductsCarousel validatedProducts={validatedProducts} />
      </div>
    </div>
  );
}

type Props = {
  validatedProducts?: common_OrderItem[];
};

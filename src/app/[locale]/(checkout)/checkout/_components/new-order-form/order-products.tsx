import { common_OrderItem } from "@/api/proto-http/frontend";

import CartProductsList from "@/app/[locale]/(checkout)/cart/_components/CartProductsList";
import { cn } from "@/lib/utils";

import { MobileProductsCarousel } from "./mobile-products-carousel";

export function OrderProducts({
  validatedProducts,
  currencyKey,
  disabled = false,
  disableProductLinks = false,
  hideMobileCarousel = false,
  className,
}: Props) {
  const expandedProducts = validatedProducts
    ? validatedProducts.flatMap((item) =>
        Array.from({ length: item.orderItem?.quantity || 1 }, () => ({
          ...item,
          orderItem: {
            variantSku: item.orderItem?.variantSku!,
            quantity: 1,
          },
        })),
      )
    : undefined;

  return (
    <div>
      <div
        className={cn(className, {
          "hidden lg:block": !hideMobileCarousel,
        })}
      >
        <CartProductsList
          hideQuantityButtons
          validatedProducts={expandedProducts}
          currencyKey={currencyKey}
          disabled={disabled}
          disableProductLinks={disableProductLinks}
        />
      </div>

      {!hideMobileCarousel ? (
        <div className="block lg:hidden">
          <MobileProductsCarousel
            validatedProducts={expandedProducts}
            currencyKey={currencyKey}
            disabled={disabled}
            disableProductLinks={disableProductLinks}
          />
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  validatedProducts?: common_OrderItem[];
  currencyKey?: string;
  disabled?: boolean;
  disableProductLinks?: boolean;
  hideMobileCarousel?: boolean;
  className?: string;
};

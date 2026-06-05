"use client";

import { useTranslations } from "next-intl";

import { useLastViewed } from "@/lib/stores/last-viewed/store-provider.";
import { cn } from "@/lib/utils";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import { ProductItem } from "@/app/[locale]/_components/product-item";

// Heavy "recently viewed" grid (ProductItem cards). Loaded on demand by the
// LastViewedProducts wrapper once the section nears the viewport, so its JS
// stays out of the initial product-page bundle.
export function LastViewedList({
  currentProductId,
}: {
  currentProductId?: number;
}) {
  const products = useLastViewed((state) => state.products);
  const t = useTranslations("product");

  const filteredProducts = products
    .filter((viewedProduct) => viewedProduct.id !== currentProductId)
    .slice(0, 4);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-col items-center gap-y-16 pb-14 lg:pb-16 lg:pt-16")}
    >
      <Text
        component="h2"
        className="w-full text-left lg:text-center"
        variant="uppercase"
      >
        {t("recently viewed")}
      </Text>

      <div className="flex justify-center gap-2 lg:gap-7">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className={cn("group relative w-40 lg:w-52", {
              "hidden lg:block": index >= 2,
            })}
            data-bottom-sheet-ignore-drag="true"
          >
            <div className="relative">
              <ProductItem
                className="w-full"
                product={product}
                isInfoVisible={false}
                disableAnimations={true}
              />
              <div className="hidden lg:block">
                <Overlay cover="container" color="highlight" trigger="hover" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

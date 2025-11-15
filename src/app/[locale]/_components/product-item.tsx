import type { common_Product } from "@/api/proto-http/frontend";
import {
  currencySymbols,
  EMPTY_PREORDER,
  PLURIAL_SINGLE_CATEGORY_MAP,
} from "@/constants";
import { useTranslations } from "next-intl";

import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculateAspectRatio, cn, isDateTodayOrFuture } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { useAnalytics } from "../catalog/_components/useAnalytics";

export function ProductItem({
  product,
  className,
  isInfoVisible = true,
}: {
  product: common_Product;
  className: string;
  isInfoVisible?: boolean;
}) {
  const t = useTranslations("categories");
  const { dictionary } = useDataContext();
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const { handleSelectItemEvent } = useAnalytics();

  const productBody = product.productDisplay?.productBody?.productBodyInsert;
  const salePercentage = productBody?.salePercentage?.value || "0";
  const isSaleApplied = salePercentage && salePercentage !== "0";
  const preorder = productBody?.preorder;
  const fit = productBody?.fit || "";
  const topCategory = getTopCategoryName(
    dictionary?.categories || [],
    productBody?.topCategoryId || 0,
  );
  const subCategory = getSubCategoryName(
    dictionary?.categories || [],
    productBody?.subCategoryId || 0,
  );
  const categoryName = (subCategory || topCategory || "").toLowerCase();
  const singularCategory =
    PLURIAL_SINGLE_CATEGORY_MAP[categoryName] ||
    subCategory ||
    topCategory ||
    "";
  const translatedCategory = singularCategory
    ? t(singularCategory.toLowerCase())
    : "";
  const name = `${fit} ${translatedCategory}`;

  const priceWithSale =
    (parseFloat(product.prices?.[0]?.price?.value || "0") *
      (100 - parseInt(salePercentage || "0"))) /
    100;

  return (
    <div className={cn("relative", className)}>
      <AnimatedButton
        href={product?.slug || ""}
        onMouseDown={() => handleSelectItemEvent(product)}
        className={cn("group flex h-full w-full flex-col", className)}
      >
        <div className="relative">
          <Image
            src={
              product.productDisplay?.thumbnail?.media?.thumbnail?.mediaUrl ||
              ""
            }
            alt={name}
            aspectRatio={calculateAspectRatio(
              product.productDisplay?.thumbnail?.media?.thumbnail?.width,
              product.productDisplay?.thumbnail?.media?.thumbnail?.height,
            )}
            fit="contain"
          />
        </div>
        <div
          className={cn("flex w-full flex-col gap-2 pt-2", {
            hidden: !isInfoVisible,
          })}
        >
          <Text
            variant="undrleineWithColors"
            className="overflow-hidden text-ellipsis leading-none group-[:visited]:text-visitedLinkColor"
          >
            {name}
          </Text>
          <div className="flex gap-1 leading-none">
            <Text variant={isSaleApplied ? "strileTroughInactive" : "default"}>
              {`${currencySymbols[selectedCurrency]} ${convertPrice(product.prices?.[0].price?.value || "")}`}
            </Text>
            {isSaleApplied && (
              <Text>{`${currencySymbols[selectedCurrency]} ${convertPrice(priceWithSale.toString())}`}</Text>
            )}
            {preorder !== EMPTY_PREORDER &&
              isDateTodayOrFuture(preorder || "") && (
                <Text variant="inactive">preorder</Text>
              )}
          </div>
        </div>
      </AnimatedButton>
    </div>
  );
}

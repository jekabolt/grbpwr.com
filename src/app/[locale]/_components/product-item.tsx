import type { common_Product } from "@/api/proto-http/frontend";
import {
  currencySymbols,
  EMPTY_PREORDER,
  PLURIAL_SINGLE_CATEGORY_MAP,
} from "@/constants";
import { useTranslations } from "next-intl";

import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, cn, isDateTodayOrFuture } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { useAnalytics } from "../catalog/_components/useAnalytics";

export function ProductItem({
  product,
  className,
  isInfoVisible = true,
  imagePriority = false,
}: {
  product: common_Product;
  className: string;
  isInfoVisible?: boolean;
  imagePriority?: boolean;
}) {
  const tCatalog = useTranslations("catalog");
  const t = useTranslations("categories");
  const tFit = useTranslations("fit");

  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((s) => s);
  const { handleSelectItemEvent } = useAnalytics();

  const currencyKey = currentCountry.currencyKey || "EUR";
  const productBody = product.productDisplay?.productBody?.productBodyInsert;
  const salePercentage = productBody?.salePercentage?.value || "0";
  const isSaleApplied = salePercentage && salePercentage !== "0";
  const isSoldOut = product.soldOut;
  const preorder = productBody?.preorder;
  const fit = productBody?.fit ? tFit(productBody.fit) : "";
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
  const name = fit ? `${fit} ${translatedCategory}` : translatedCategory;

  const productPrice =
    product.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];

  const priceValue = productPrice?.price?.value || "0";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];

  const priceWithSale =
    (parseFloat(priceValue) * (100 - parseInt(salePercentage || "0"))) / 100;

  const formattedPrice = parseFloat(priceValue).toFixed(2);
  const formattedPriceWithSale = priceWithSale.toFixed(2);

  return (
    <div className={cn("relative", className)}>
      <AnimatedButton
        href={product?.slug || ""}
        onMouseDown={() => handleSelectItemEvent(product)}
        enableThresholdAnimation={true}
        className={cn("group flex h-full w-full flex-col", className)}
      >
        <div className="group-data-[held=true]:animate-threshold-highlight relative">
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
            priority={imagePriority}
            loading={imagePriority ? "eager" : "lazy"}
          />
          <Overlay cover="container" color="highlight" trigger="held" />
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
            {isSoldOut ? (
              <Text>{tCatalog("sold out")}</Text>
            ) : (
              <>
                <Text
                  variant={isSaleApplied ? "strileTroughInactive" : "default"}
                >
                  {`${currencySymbol} ${formattedPrice}`}
                </Text>
                {isSaleApplied && (
                  <Text>{`${currencySymbol} ${formattedPriceWithSale}`}</Text>
                )}
                {preorder !== EMPTY_PREORDER &&
                  isDateTodayOrFuture(preorder || "") && (
                    <Text variant="inactive">preorder</Text>
                  )}
              </>
            )}
          </div>
        </div>
      </AnimatedButton>
    </div>
  );
}

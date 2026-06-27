import { useState } from "react";
import type { common_Product } from "@/api/proto-http/frontend";
import {
  currencySymbols,
  EMPTY_PREORDER,
  PLURIAL_SINGLE_CATEGORY_MAP,
} from "@/constants";
import { useTranslations } from "next-intl";

import { getSubCategoryName, getTopCategoryName } from "@/lib/categories-map";
import { formatPrice } from "@/lib/currency";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, cn, isDateTodayOrFuture } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { useVisitedLink } from "../catalog/_components/use-visited-link";
import { useAnalytics } from "../catalog/_components/useAnalytics";

export function ProductItem({
  product,
  className,
  isInfoVisible = true,
  disableAnimations = false,
  imagePriority = false,
}: {
  product: common_Product;
  className: string;
  isInfoVisible?: boolean;
  disableAnimations?: boolean;
  imagePriority?: boolean;
}) {
  const tCatalog = useTranslations("catalog");
  const t = useTranslations("categories");
  const tFit = useTranslations("fit");
  const tProduct = useTranslations("product");

  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((s) => s);
  const { handleSelectItemEvent } = useAnalytics();
  const visited = useVisitedLink(product?.slug);

  // Mobile only: touching a catalog card shows the blue highlight overlay over
  // the image (like the zoom pulse on the product detail page).
  const [pressed, setPressed] = useState(false);
  const onPressEnd = () => setPressed(false);

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
  // Objects use their category/sub-category name as-is (no "fit" prefix that
  // garments get).
  const isObjects = topCategory?.toLowerCase() === "objects";
  const name =
    fit && !isObjects ? `${fit} ${translatedCategory}` : translatedCategory;

  const productPrice =
    product.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];

  const priceValue = productPrice?.price?.value || "0";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];

  const priceWithSale =
    (parseFloat(priceValue) * (100 - parseInt(salePercentage || "0"))) / 100;

  const formattedPrice = formatPrice(priceValue, currencyKey, currencySymbol);
  const formattedPriceWithSale = formatPrice(
    priceWithSale,
    currencyKey,
    currencySymbol,
  );

  return (
    <div className={cn("relative", className)}>
      <AnimatedButton
        href={product?.slug || ""}
        onMouseDown={() => handleSelectItemEvent(product)}
        enableThresholdAnimation={!disableAnimations}
        className={cn("group flex h-full w-full flex-col", className)}
      >
        <div
          onPointerDown={(e) => {
            if (!disableAnimations && e.pointerType === "touch")
              setPressed(true);
          }}
          // Keep the highlight on after release (tap navigates → this card
          // unmounts, clearing it). Only a scroll/drag (pointercancel) clears it.
          onPointerCancel={onPressEnd}
          className={cn("relative", {
            "motion-safe:group-data-[held=true]:animate-threshold-highlight":
              !disableAnimations,
          })}
        >
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
            blurhash={product.productDisplay?.thumbnail?.media?.blurhash}
            fit="contain"
            priority={imagePriority}
            loading={imagePriority ? "eager" : "lazy"}
          />
          {!disableAnimations && (
            <Overlay
              cover="container"
              color="highlight"
              trigger="active"
              active={pressed}
              className="lg:hidden"
            />
          )}
        </div>
        <div
          className={cn("flex w-full flex-col gap-2 pt-2", {
            hidden: !isInfoVisible,
          })}
        >
          <Text
            variant="productLink"
            component="span"
            data-visited={visited ? "true" : undefined}
            className={cn(
              "overflow-hidden text-ellipsis leading-none",
              visited && "is-visited",
            )}
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
                  {formattedPrice}
                </Text>
                {isSaleApplied && <Text>{formattedPriceWithSale}</Text>}
                {preorder !== EMPTY_PREORDER &&
                  isDateTodayOrFuture(preorder || "") && (
                    <Text variant="uppercase">{tProduct("preorder")}</Text>
                  )}
              </>
            )}
          </div>
        </div>
      </AnimatedButton>
    </div>
  );
}

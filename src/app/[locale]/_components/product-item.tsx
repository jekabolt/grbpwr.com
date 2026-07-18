import { useState } from "react";
import type { StorefrontColorway } from "@/api/proto-http/frontend";
import {
  currencySymbols,
  EMPTY_PREORDER,
  PLURIAL_SINGLE_CATEGORY_MAP,
} from "@/constants";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/currency";
import { useViewerTier } from "@/lib/hooks/use-viewer-tier";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { lockedTeaserHref } from "@/lib/tier";
import { cn, isDateTodayOrFuture } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { LockIcon } from "@/components/ui/icons/lock";
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
  infoClassName,
  imageFit = "contain",
  locked = false,
}: {
  product: StorefrontColorway;
  className: string;
  isInfoVisible?: boolean;
  disableAnimations?: boolean;
  imagePriority?: boolean;
  // Locked teaser variant: greyscale image, a lock badge with viewer-adaptive
  // copy, no price and no PDP navigation. The card is reused widely (heroes,
  // archive, carousels), so locking is opt-in — only the catalogue grids pass
  // it. Off by default keeps every other caller untouched.
  locked?: boolean;
  // Extra classes for the name/price block. Lets a caller pull the caption out
  // of flow (e.g. hero SPLIT centres just the image by making the info absolute
  // on desktop). Off by default, so the catalog cards are unaffected.
  infoClassName?: string;
  // How the thumbnail sits in its fixed 3/4 box. "contain" (default) letterboxes
  // it so the whole garment shows — the catalog look. "cover" crops it to fill
  // the box edge-to-edge, so a row of cards is pixel-identical (the archive).
  imageFit?: "contain" | "cover";
}) {
  const tCatalog = useTranslations("catalog");
  const t = useTranslations("categories");
  const tFit = useTranslations("fit");
  const tProduct = useTranslations("product");

  const { currentCountry, languageId } = useTranslationsStore((s) => s);
  const { handleSelectItemEvent } = useAnalytics();
  const visited = useVisitedLink(product?.slug);

  // Locked teasers adapt to the viewer: guests are invited to sign in, signed-in
  // members below the required tier are told it's members-only. They route to
  // sign-in / the account page instead of the (purchase-blocked) PDP.
  const { isSignedIn } = useViewerTier();
  const lockedLabel = isSignedIn
    ? tCatalog("members only")
    : tCatalog("sign in to access");
  const href = locked ? lockedTeaserHref(isSignedIn) : product?.slug || "";

  // Mobile only: touching a catalog card shows the blue highlight overlay over
  // the image (like the zoom pulse on the product detail page).
  const [pressed, setPressed] = useState(false);
  const onPressEnd = () => setPressed(false);

  const currencyKey = currentCountry.currencyKey || "EUR";
  const display = product.display;
  const salePercentage = display?.salePercentage?.value || "0";
  const isSaleApplied =
    salePercentage !== "0" && parseFloat(salePercentage) > 0;
  const isSoldOut = product.soldOut;
  const preorder = display?.preorder;
  const fit = display?.fit ? tFit(display.fit) : "";
  // category_labels = resolved [top, sub, type] names.
  const [topCategory, subCategory] = display?.categoryLabels || [];
  const categoryName = (subCategory || topCategory || "").toLowerCase();
  const singularCategory =
    PLURIAL_SINGLE_CATEGORY_MAP[categoryName] ||
    subCategory ||
    topCategory ||
    "";
  const translatedCategory = singularCategory
    ? t(singularCategory.toLowerCase())
    : "";
  // Objects use their category name as-is (no "fit" prefix that garments get).
  const isObjects = topCategory?.toLowerCase() === "objects";
  const currentTranslation =
    display?.translations?.find((tr) => tr.languageId === languageId) ||
    display?.translations?.[0];
  const name =
    (fit && !isObjects ? `${fit} ${translatedCategory}` : translatedCategory) ||
    currentTranslation?.name ||
    "";

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
        href={href}
        onMouseDown={locked ? undefined : () => handleSelectItemEvent(product)}
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
          className={cn(
            "relative",
            // "cover" callers crop-fill the box, so pin the box here (a definite
            // 3/4 aspect) and clip the overflow — `fit="cover"` drops the box off
            // the shared <ImageComponent>, which would otherwise collapse.
            imageFit === "cover" && "aspect-[3/4] overflow-hidden",
            // Locked teaser: the garment stays "undeveloped" (greyscale), never
            // resolving to colour like the threshold reveal — a withheld piece.
            locked && "grayscale",
            {
              "group-data-[held=true]:animate-threshold-highlight":
                !disableAnimations,
            },
          )}
        >
          <Image
            src={product.display?.thumbnail?.media?.thumbnail?.mediaUrl || ""}
            alt={name}
            // Fixed 3/4 box (matches the catalog skeleton) so every card is the
            // same height wherever cards sit side by side — grid, carousel or the
            // SPLIT hero, on desktop and mobile. Tall enough that portrait product
            // shots fill it without side letterboxing. Default `contain` keeps the
            // whole garment visible; `cover` crops it to fill the box exactly.
            aspectRatio="3/4"
            blurhash={product.display?.thumbnail?.media?.blurhash}
            fit={imageFit}
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
          {locked && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-center gap-1.5 bg-textColor px-2 py-1.5 text-center text-bgColor">
              <LockIcon className="h-3.5 w-3.5 shrink-0" />
              <Text
                variant="uppercase"
                component="span"
                className="leading-none"
              >
                {lockedLabel}
              </Text>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex w-full flex-col gap-2 pt-2",
            { hidden: !isInfoVisible },
            infoClassName,
          )}
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
          {!locked && (
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
                      <Text variant="inactive">{tProduct("preorder")}</Text>
                    )}
                </>
              )}
            </div>
          )}
        </div>
      </AnimatedButton>
    </div>
  );
}

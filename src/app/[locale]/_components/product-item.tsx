import { useState } from "react";
import type { StorefrontColorway } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/currency";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn } from "@/lib/utils";
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
  infoClassName,
  imageFit = "contain",
}: {
  product: StorefrontColorway;
  className: string;
  isInfoVisible?: boolean;
  disableAnimations?: boolean;
  imagePriority?: boolean;
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
  const tFit = useTranslations("fit");

  const { currentCountry, languageId } = useTranslationsStore((s) => s);
  const { handleSelectItemEvent } = useAnalytics();
  const visited = useVisitedLink(product?.slug);

  // Mobile only: touching a catalog card shows the blue highlight overlay over
  // the image (like the zoom pulse on the product detail page).
  const [pressed, setPressed] = useState(false);
  const onPressEnd = () => setPressed(false);

  const currencyKey = currentCountry.currencyKey || "EUR";
  const display = product.display;
  // The lean storefront projection (R3) carries no per-colourway sale percentage,
  // category ids or preorder date, so the card shows the list price only and labels
  // itself with the product's own translated name (falling back to the fit) instead
  // of the former "{fit} {category}" caption.
  const isSoldOut = product.soldOut;
  const currentTranslation =
    display?.translations?.find((tr) => tr.languageId === languageId) ||
    display?.translations?.[0];
  const fit = display?.fit ? tFit(display.fit) : "";
  const name = currentTranslation?.name || fit || "";

  const productPrice =
    product.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product.prices?.[0];

  const priceValue = productPrice?.price?.value || "0";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];

  const formattedPrice = formatPrice(priceValue, currencyKey, currencySymbol);

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
          className={cn(
            "relative",
            // "cover" callers crop-fill the box, so pin the box here (a definite
            // 3/4 aspect) and clip the overflow — `fit="cover"` drops the box off
            // the shared <ImageComponent>, which would otherwise collapse.
            imageFit === "cover" && "aspect-[3/4] overflow-hidden",
            {
              "group-data-[held=true]:animate-threshold-highlight":
                !disableAnimations,
            },
          )}
        >
          <Image
            src={
              product.display?.thumbnail?.media?.thumbnail?.mediaUrl ||
              ""
            }
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
          <div className="flex gap-1 leading-none">
            {isSoldOut ? (
              <Text>{tCatalog("sold out")}</Text>
            ) : (
              <Text>{formattedPrice}</Text>
            )}
          </div>
        </div>
      </AnimatedButton>
    </div>
  );
}

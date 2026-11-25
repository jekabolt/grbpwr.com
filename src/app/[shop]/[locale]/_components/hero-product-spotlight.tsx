"use client";

import type { common_HeroProductSpotlightWithTranslations } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { formatPrice } from "@/lib/currency";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { cn, internalHref } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Text } from "@/components/ui/text";

import { HeroMedia } from "./hero-media";

// PRODUCT_SPOTLIGHT hero: a big product shot (the block's HeroMediaFull) beside a
// panel with the campaign headline, price and a CTA to the product. The panes
// stack on mobile. Price/sale are derived from the light `common_Colorway` the
// backend sends.
//
// Decision B (quick-add depth) — MVP: the CTA links to the product page ("view
// product"). True in-hero add-to-cart needs the full product (sizes/stock), which
// the light spotlight product does not carry; that is a deliberate follow-up.
export function HeroProductSpotlight({
  spotlight,
  priority = false,
  onHeroClick,
}: {
  spotlight?: common_HeroProductSpotlightWithTranslations;
  priority?: boolean;
  onHeroClick?: () => void;
}) {
  const { languageId, currentCountry } = useTranslationsStore((s) => s);
  if (!spotlight) return null;

  const product = spotlight.product;
  const t =
    spotlight.translations?.find((x) => x.languageId === languageId) ||
    spotlight.translations?.[0];

  const currencyKey = currentCountry.currencyKey || "EUR";
  const currencySymbol = currencySymbols[currencyKey] || currencySymbols["EUR"];
  const salePercentage =
    product?.display?.merchandising?.salePercentage?.value || "0";
  const isSaleApplied = salePercentage !== "0";
  const productPrice =
    product?.prices?.find(
      (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
    ) || product?.prices?.[0];
  const priceValue = productPrice?.price?.value || "0";
  const formattedPrice = formatPrice(priceValue, currencyKey, currencySymbol);
  const formattedSalePrice = formatPrice(
    (parseFloat(priceValue) * (100 - parseInt(salePercentage))) / 100,
    currencyKey,
    currencySymbol,
  );

  const ctaText = t?.ctaText || t?.exploreText;
  const ctaHref = spotlight.exploreLink
    ? internalHref(spotlight.exploreLink)
    : product?.slug || "";

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="relative h-[70vh] w-full lg:h-screen lg:w-1/2">
        <HeroMedia media={spotlight.media} priority={priority} preferPortrait />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-6 p-6 text-center lg:h-screen lg:w-1/2">
        {t?.headline && (
          <Text component="h2" variant="uppercase">
            {t.headline}
          </Text>
        )}
        {t?.subhead && <Text variant="uppercase">{t.subhead}</Text>}
        {productPrice && (
          <div className="flex items-center gap-3">
            <Text className={cn({ "line-through": isSaleApplied })}>
              {formattedPrice}
            </Text>
            {isSaleApplied && <Text>{formattedSalePrice}</Text>}
          </div>
        )}
        {ctaText && ctaHref && (
          <AnimatedButton href={ctaHref} onClick={onHeroClick}>
            <Text variant="uppercase" className="underline">
              {ctaText}
            </Text>
          </AnimatedButton>
        )}
      </div>
    </div>
  );
}

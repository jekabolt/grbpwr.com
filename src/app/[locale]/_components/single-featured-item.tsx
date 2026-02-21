import { common_Product } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";
import { useState } from "react";

import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, calculatePriceWithSale } from "@/lib/utils";

export function SingleFeaturedItem({
  products,
  headline,
}: {
  products: common_Product[];
  headline?: string;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const { currentCountry } = useTranslationsStore((state) => state);
  const [isHovered, setIsHovered] = useState(false);

  const currencyKey = currentCountry.currencyKey || "EUR";

  return (
    <div>
      {products?.map((p) => {
        const productBody = p.productDisplay?.productBody?.productBodyInsert;
        const price =
          p.prices?.find(
            (p) => p.currency?.toUpperCase() === currencyKey.toUpperCase(),
          ) || p.prices?.[0];
        const salePercentage = productBody?.salePercentage?.value || "0";
        const salePercentageNum = parseInt(salePercentage, 10);
        const isSaleApplied = salePercentageNum > 0;

        const priceWithSale = calculatePriceWithSale(
          price?.price?.value,
          salePercentage,
        );

        const currentTranslation =
          p.productDisplay?.productBody?.translations?.find(
            (t) => t.languageId === languageId,
          );
        return (
          <div key={p.id} className="relative flex h-screen w-full justify-end">
            <div className="absolute inset-x-2.5 top-1/2 z-40 flex -translate-y-1/2 text-bgColor mix-blend-exclusion selection:bg-inverted selection:text-textColor">
              <div className="flex w-1/2 selection:bg-acidColor">
                <div className="flex w-full flex-row gap-3 whitespace-nowrap">
                  <Text variant="uppercase">{headline}</Text>
                </div>

                <Text
                  variant="undrleineWithColors"
                  className="w-full overflow-hidden leading-none text-inverted group-[:visited]:text-visitedLinkColor"
                >
                  {currentTranslation?.name}
                </Text>
              </div>

              <div className="flex w-1/2 pl-24">
                <div className="flex w-full gap-1 leading-none">
                  <Text
                    variant={isSaleApplied ? "strileTroughInactive" : "default"}
                  >
                    {formatPrice(price?.price?.value || "0", currencyKey, currencySymbols[currentCountry.currencyKey || "EUR"])}
                  </Text>
                  {isSaleApplied && (
                    <Text>{formatPrice(priceWithSale, currencyKey, currencySymbols[currentCountry.currencyKey || "EUR"])}</Text>
                  )}
                </div>
                <Text
                  variant={isHovered ? "underlined" : "default"}
                  className="whitespace-nowrap uppercase"
                >
                  buy now
                </Text>
              </div>
            </div>
            <AnimatedButton
              href={p.slug || ""}
              animationArea="container"
              className="h-full w-1/2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={
                  p.productDisplay?.thumbnail?.media?.thumbnail?.mediaUrl || ""
                }
                alt={currentTranslation?.name || ""}
                aspectRatio={calculateAspectRatio(
                  p.productDisplay?.thumbnail?.media?.thumbnail?.width,
                  p.productDisplay?.thumbnail?.media?.thumbnail?.height,
                )}
                fit="contain"
                priority={true}
                loading="eager"
              />
            </AnimatedButton>
          </div>
        );
      })}
    </div>
  );
}

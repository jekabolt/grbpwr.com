import { useState } from "react";
import { common_Product } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function SingleFeaturedItem({
  products,
  headline,
}: {
  products: common_Product[];
  headline?: string;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      {products?.map((p) => {
        const priceWithSale =
          (parseFloat(p.prices?.[0]?.price?.value || "0") *
            (100 -
              parseInt(
                p.productDisplay?.productBody?.productBodyInsert?.salePercentage
                  ?.value || "0",
              ))) /
          100;
        const isSaleApplied =
          parseInt(
            p.productDisplay?.productBody?.productBodyInsert?.salePercentage
              ?.value || "0",
          ) > 0;

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
                    {`${currencySymbols[selectedCurrency]} ${convertPrice(p.prices?.[0]?.price?.value || "")}`}
                  </Text>
                  {isSaleApplied && (
                    <Text>{`${currencySymbols[selectedCurrency]} ${convertPrice(priceWithSale.toString())}`}</Text>
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
              />
            </AnimatedButton>
          </div>
        );
      })}
    </div>
  );
}

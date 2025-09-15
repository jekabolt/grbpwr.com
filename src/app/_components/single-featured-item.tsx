import { useState } from "react";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { FeaturedItemsData } from "./featured-items";

export function SingleFeaturedItem({ data }: { data: FeaturedItemsData }) {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      {data.products?.map((p) => {
        const priceWithSale =
          (parseFloat(
            p.productDisplay?.productBody?.productBodyInsert?.price?.value ||
              "0",
          ) *
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

        return (
          <div key={p.id} className="relative flex h-screen w-full justify-end">
            <div className="absolute inset-x-2.5 top-1/2 z-40 flex -translate-y-1/2 text-bgColor mix-blend-exclusion selection:bg-inverted selection:text-textColor">
              <div className="flex w-1/2 selection:bg-acidColor">
                <div className="flex w-full flex-row gap-3 whitespace-nowrap">
                  <Text variant="uppercase">{data.headline}</Text>
                </div>

                <Text
                  variant="undrleineWithColors"
                  className="w-full overflow-hidden leading-none text-inverted group-[:visited]:text-visitedLinkColor"
                >
                  {p.productDisplay?.productBody?.translations?.[0].name}
                </Text>
              </div>

              <div className="flex w-1/2 pl-24">
                <div className="flex w-full gap-1 leading-none">
                  <Text
                    variant={isSaleApplied ? "strileTroughInactive" : "default"}
                  >
                    {`${currencySymbols[selectedCurrency]} ${convertPrice(p.productDisplay?.productBody?.productBodyInsert?.price?.value || "")}`}
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
                alt={
                  p.productDisplay?.productBody?.translations?.[0].name || ""
                }
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

import { common_Product } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Carousel } from "@/components/ui/carousel";

import { HeaderSection } from "./featured-items";
import { ProductItem } from "./product-item";

export function MobileFeaturedItems({
  products,
  headline,
  exploreText,
  exploreLink,
  itemsQuantity,
  onHeroClick,
}: {
  products: common_Product[];
  headline?: string;
  exploreText?: string;
  exploreLink?: string;
  itemsQuantity: number;
  onHeroClick?: () => void;
}) {
  const isMultipleItems = itemsQuantity > 1;
  const itemSlug = products?.[0]?.slug || "";
  const nonScrollable =
    itemsQuantity === 1 || itemsQuantity === 2 || itemsQuantity === 4;

  return (
    <div className="space-y-10 py-16">
      <div className="px-2.5">
        <HeaderSection
          headline={headline}
          href={isMultipleItems ? exploreLink || "" : itemSlug}
          linkText={isMultipleItems ? exploreText || "" : "buy now"}
          onHeroClick={onHeroClick}
        />
      </div>
      <Carousel
        loop={!nonScrollable}
        align="center"
        startIndex={0}
        disableForItemCounts={[1, 2, 4]}
        className={cn("flex", {
          "gap-0": itemsQuantity >= 3 && itemsQuantity !== 4,
          "grid grid-cols-2 gap-4": itemsQuantity === 4,
        })}
      >
        {products?.map((p) => (
          <ProductItem
            key={p.id}
            className={cn("w-44 px-2.5", {
              "w-full": !isMultipleItems,
              "flex-[0_0_50%]": isMultipleItems,
              "w-44 px-0": itemsQuantity >= 3 && itemsQuantity !== 4,
            })}
            product={p}
          />
        ))}
      </Carousel>
    </div>
  );
}

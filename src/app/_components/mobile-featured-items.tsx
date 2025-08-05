import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Text } from "@/components/ui/text";

import { FeaturedItemsData } from "./featured-items";
import { ProductItem } from "./product-item";

export function MobileFeaturedItems({
  data,
  itemsQuantity,
}: {
  data: FeaturedItemsData;
  itemsQuantity: number;
}) {
  const isMultipleItems = itemsQuantity > 1;
  const itemSlug = data.products?.[0]?.slug || "";

  return (
    <div className="space-y-10">
      <div className="px-2.5">
        <HeaderSection
          data={data}
          href={isMultipleItems ? data.exploreLink || "" : itemSlug}
          linkText={isMultipleItems ? data.exploreText || "" : "buy now"}
        />
      </div>
      <Carousel
        loop
        align="center"
        disableForItemCounts={[1, 2, 4]}
        className={cn("flex gap-2.5", {
          "gap-0": itemsQuantity >= 3 && itemsQuantity !== 4,
          "grid grid-cols-2 gap-4": itemsQuantity === 4,
        })}
      >
        {data.products?.map((p) => (
          <ProductItem
            key={p.id}
            className={cn("w-44 px-2.5", {
              "w-full": !isMultipleItems,
              "flex-[0_0_50%]": isMultipleItems,
              "px-0": itemsQuantity >= 3 && itemsQuantity !== 4,
            })}
            product={p}
          />
        ))}
      </Carousel>
    </div>
  );
}

function HeaderSection({
  data,
  href,
  linkText,
}: {
  data: FeaturedItemsData;
  href: string;
  linkText: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="uppercase">{data.headline}</Text>
      <Button variant="underline" className="uppercase" asChild>
        <Link href={href}>{linkText}</Link>
      </Button>
    </div>
  );
}

import Link from "next/link";
import { common_Product } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { MobileFeaturedItems } from "./mobile-featured-items";
import { ProductItem } from "./product-item";
import { SingleFeaturedItem } from "./single-featured-item";

export interface FeaturedItemsData {
  headline?: string;
  exploreText?: string;
  exploreLink?: string;
  products?: common_Product[];
}

export function FeaturedItems({
  data,
  itemsQuantity,
}: {
  data: FeaturedItemsData | undefined;
  itemsQuantity: number;
}) {
  if (!data) return null;

  return (
    <>
      <div className="block lg:hidden">
        <MobileFeaturedItems data={data} itemsQuantity={itemsQuantity} />
      </div>

      {itemsQuantity === 1 ? (
        <SingleFeaturedItem data={data} />
      ) : (
        <div
          className={cn(
            "hidden h-full items-center gap-64 overflow-x-auto pl-2.5 lg:flex",
            {
              "justify-between overflow-x-hidden": itemsQuantity === 2,
            },
          )}
        >
          <div className="flex w-full flex-row gap-3 whitespace-nowrap">
            <Text variant="uppercase">{data.headline}</Text>
            <Button variant="underline" className="uppercase" asChild>
              <Link href={data.exploreLink || ""}>{data.exploreText}</Link>
            </Button>
          </div>
          <div
            className={cn("flex flex-row gap-12", {
              "gap-2.5": itemsQuantity === 2,
            })}
          >
            {data.products?.map((p) => (
              <ProductItem
                key={p.id}
                className={cn("w-80", {
                  "w-72 lg:w-[32rem]": itemsQuantity === 1,
                  "w-[28rem]": itemsQuantity === 2,
                })}
                product={p}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

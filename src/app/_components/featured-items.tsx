import Link from "next/link";
import { common_Product } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
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
  if (itemsQuantity === 1 && data) {
    return <SingleFeaturedItem data={data} />;
  }

  if (itemsQuantity >= 4 && data) {
    return <FourFeaturedItems data={data} />;
  }

  if (!data) return null;

  return (
    <>
      <div className="block lg:hidden">
        <MobileFeaturedItems data={data} itemsQuantity={itemsQuantity} />
      </div>

      <div
        className={cn(
          "hidden h-full items-center gap-64 overflow-x-auto py-16 pl-2.5 lg:flex",
          {
            "justify-between gap-0 overflow-x-hidden":
              itemsQuantity === 2 || itemsQuantity === 3,
          },
        )}
      >
        <HeaderSection
          data={data}
          href={data.exploreLink || ""}
          linkText={data.exploreText || ""}
          className="flex w-full flex-row gap-3 whitespace-nowrap"
        />
        <div
          className={cn("flex flex-row gap-12", {
            "gap-2.5": itemsQuantity === 2,
          })}
        >
          {data.products?.map((p) => (
            <ProductItem
              key={p.id}
              className={cn("w-80", {
                "w-[28rem]": itemsQuantity === 2,
                "w-72": itemsQuantity === 3,
              })}
              product={p}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function FourFeaturedItems({ data }: { data: FeaturedItemsData }) {
  return (
    <div className="flex w-full flex-col gap-12 pl-2.5">
      <HeaderSection
        data={data}
        href={data.exploreLink || ""}
        linkText={data.exploreText || ""}
        className="flex w-full flex-row gap-3 whitespace-nowrap"
      />
      <Carousel loop className="flex w-full gap-12">
        {data.products?.map((p) => (
          <ProductItem key={p.id} className="w-80" product={p} />
        ))}
      </Carousel>
    </div>
  );
}

export function HeaderSection({
  data,
  href,
  linkText,
  className,
}: {
  data: FeaturedItemsData;
  href: string;
  linkText: string;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <Text variant="uppercase">{data.headline}</Text>
      <Button variant="underline" className="uppercase" asChild>
        <Link href={href}>{linkText}</Link>
      </Button>
    </div>
  );
}

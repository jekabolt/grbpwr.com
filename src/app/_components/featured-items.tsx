import { common_Product } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
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
  if (!data) return null;

  return (
    <div>
      <div className="block lg:hidden">
        <MobileFeaturedItems data={data} itemsQuantity={itemsQuantity} />
      </div>

      <div
        className={cn("group hidden py-32 lg:block", {
          "py-0": itemsQuantity === 1,
        })}
      >
        {itemsQuantity === 1 && <SingleFeaturedItem data={data} />}
        {itemsQuantity >= 4 && <FourFeaturedItems data={data} />}
        {(itemsQuantity === 2 || itemsQuantity === 3) && (
          <div className="flex h-full items-center justify-between pl-2.5">
            <HeaderSection
              data={data}
              href={data.exploreLink || ""}
              linkText={data.exploreText || ""}
            />
            <div className="flex flex-row gap-12">
              {data.products?.map((p) => (
                <ProductItem
                  key={p.id}
                  className={cn("w-[28rem]", {
                    "w-72": itemsQuantity === 3,
                  })}
                  product={p}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FourFeaturedItems({ data }: { data: FeaturedItemsData }) {
  return (
    <div className="space-y-12">
      <HeaderSection
        data={data}
        href={data.exploreLink || ""}
        linkText={data.exploreText || ""}
      />
      <Carousel loop className="flex w-full">
        {data.products?.map((p) => (
          <ProductItem key={p.id} className="flex-[0_0_25%] px-6" product={p} />
        ))}
      </Carousel>
    </div>
  );
}

export function HeaderSection({
  data,
  href,
  linkText,
}: {
  data: FeaturedItemsData;
  href: string;
  linkText: string;
}) {
  return (
    <div>
      {data.headline && (
        <AnimatedButton
          href={href}
          animationArea="text"
          className="flex flex-row gap-2 whitespace-nowrap lg:pl-2.5"
        >
          <Text variant="uppercase">{data.headline}</Text>
          {linkText && (
            <Text className="flex gap-2 uppercase lg:hidden lg:group-hover:flex">
              <Text component="span">{`/`}</Text>
              <Text component="span">{linkText ? linkText : ""}</Text>
            </Text>
          )}
        </AnimatedButton>
      )}
    </div>
  );
}

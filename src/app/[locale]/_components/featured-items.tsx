import { common_Product } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Carousel } from "@/components/ui/carousel";
import { Text } from "@/components/ui/text";

import { MobileFeaturedItems } from "./mobile-featured-items";
import { ProductItem } from "./product-item";
import { SingleFeaturedItem } from "./single-featured-item";

export function FeaturedItems({
  headline,
  exploreText,
  exploreLink,
  products,
  tag,
  itemsQuantity,
  onHeroClick,
}: {
  headline?: string;
  exploreText?: string;
  exploreLink?: string;
  products?: common_Product[];
  tag?: string;
  itemsQuantity: number;
  onHeroClick?: () => void;
}) {
  return (
    <div>
      <div className="block lg:hidden">
        <MobileFeaturedItems
          headline={headline}
          exploreLink={exploreLink ? exploreLink : tag || ""}
          exploreText={exploreText || ""}
          products={products || []}
          itemsQuantity={itemsQuantity}
          onHeroClick={onHeroClick}
        />
      </div>

      <div
        className={cn("group hidden py-32 lg:block", {
          "py-0": itemsQuantity === 1,
        })}
      >
        {itemsQuantity === 1 && (
          <SingleFeaturedItem products={products || []} headline={headline} />
        )}
        {itemsQuantity >= 4 && (
          <FourFeaturedItems
            products={products}
            headline={headline}
            href={exploreLink ? exploreLink : tag || ""}
            linkText={exploreText || ""}
            onHeroClick={onHeroClick}
          />
        )}
        {(itemsQuantity === 2 || itemsQuantity === 3) && (
          <div className="flex h-full items-center justify-between pl-2.5">
            <HeaderSection
              headline={headline}
              href={exploreLink ? exploreLink : tag || ""}
              linkText={exploreText || ""}
              onHeroClick={onHeroClick}
            />
            <div className="flex flex-row gap-12">
              {products?.map((p, index) => (
                <ProductItem
                  key={p.id}
                  className={cn("w-[28rem]", {
                    "w-72": itemsQuantity === 3,
                  })}
                  product={p}
                  imagePriority={index === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FourFeaturedItems({
  headline,
  href,
  linkText,
  products,
  onHeroClick,
}: {
  headline?: string;

  href: string;
  linkText: string;
  products?: common_Product[];
  onHeroClick?: () => void;
}) {
  return (
    <div className="space-y-12">
      <HeaderSection headline={headline} href={href} linkText={linkText} onHeroClick={onHeroClick} />

      <Carousel disableForItemCounts={[4]} loop className="flex w-full">
        {products?.map((p, index) => (
          <ProductItem
            key={p.id}
            className="flex-[0_0_25%] px-6"
            product={p}
            imagePriority={index < 2}
          />
        ))}
      </Carousel>
    </div>
  );
}

export function HeaderSection({
  headline,
  href,
  linkText,
  onHeroClick,
}: {
  headline?: string;
  href: string;
  linkText: string;
  onHeroClick?: () => void;
}) {
  return (
    <div>
      {headline && (
        <AnimatedButton
          href={href}
          animationArea="text"
          className="flex flex-wrap items-center gap-2 uppercase lg:flex-nowrap lg:pl-2.5"
          onClick={onHeroClick}
        >
          <Text className="text-wrap">{headline}</Text>
          <Text variant="underlined">{linkText ? linkText : ""}</Text>
        </AnimatedButton>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { FeaturedItems } from "./featured-items";
import { HeroArchive } from "./hero-archive";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  return (
    <div>
      {entities?.map((e, i) => {
        switch (e.type) {
          case "HERO_TYPE_SINGLE":
            return (
              <div className="relative h-full w-full" key={i}>
                <Button asChild className="relative h-full w-full">
                  <Link href={e.single?.exploreLink || ""}>
                    <div className="hidden lg:block">
                      <Image
                        src={
                          e.single?.mediaLandscape?.media?.fullSize?.mediaUrl ||
                          ""
                        }
                        alt="ad hero image"
                        aspectRatio={calculateAspectRatio(
                          e.single?.mediaLandscape?.media?.fullSize?.width,
                          e.single?.mediaLandscape?.media?.fullSize?.height,
                        )}
                        fit="contain"
                      />
                    </div>
                    <div className="block lg:hidden">
                      <Image
                        src={
                          e.single?.mediaPortrait?.media?.fullSize?.mediaUrl ||
                          ""
                        }
                        alt="ad hero image"
                        aspectRatio={calculateAspectRatio(
                          e.single?.mediaPortrait?.media?.fullSize?.width,
                          e.single?.mediaPortrait?.media?.fullSize?.height,
                        )}
                        fit="contain"
                      />
                    </div>
                    <div className="absolute inset-0 z-20 flex items-center justify-center gap-6 text-bgColor">
                      <Text variant="uppercase">{e.single?.headline}</Text>
                      <Text variant="underlined" className="uppercase">
                        {e.single?.exploreText}
                      </Text>
                    </div>
                  </Link>
                </Button>
                <Overlay cover="container" />
              </div>
            );
          case "HERO_TYPE_DOUBLE":
            return (
              <div
                key={i}
                className="relative flex h-full w-full flex-col lg:flex-row"
              >
                <Button asChild className="relative h-full w-full">
                  <Link href={e.double?.left?.exploreLink || ""}>
                    <Image
                      src={
                        e.double?.left?.mediaLandscape?.media?.fullSize
                          ?.mediaUrl || ""
                      }
                      alt="ad hero image"
                      aspectRatio={calculateAspectRatio(
                        e.double?.left?.mediaLandscape?.media?.fullSize?.width,
                        e.double?.left?.mediaLandscape?.media?.fullSize?.height,
                      )}
                      fit="contain"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 text-bgColor">
                      <Text variant="uppercase">
                        {e.double?.left?.headline}
                      </Text>
                      <Text variant="underlined" className="uppercase">
                        {e.double?.left?.exploreText}
                      </Text>
                    </div>
                  </Link>
                </Button>
                <Button asChild className="relative h-full w-full">
                  <Link href={e.double?.right?.exploreLink || ""}>
                    <Image
                      src={
                        e.double?.right?.mediaLandscape?.media?.fullSize
                          ?.mediaUrl || ""
                      }
                      alt="ad hero image"
                      aspectRatio={calculateAspectRatio(
                        e.double?.right?.mediaLandscape?.media?.fullSize?.width,
                        e.double?.right?.mediaLandscape?.media?.fullSize
                          ?.height,
                      )}
                      fit="contain"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 text-bgColor">
                      <Text variant="uppercase">
                        {e.double?.right?.headline}
                      </Text>
                      <Text variant="underlined" className="uppercase">
                        {e.double?.right?.exploreText}
                      </Text>
                    </div>
                  </Link>
                </Button>
                <Overlay cover="container" />
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS":
            const itemsQuantity = e.featuredProducts?.products?.length || 0;
            return (
              <FeaturedItems
                key={i}
                data={e.featuredProducts}
                itemsQuantity={itemsQuantity}
              />
            );
          case "HERO_TYPE_FEATURED_PRODUCTS_TAG":
            const productsTagCount =
              e.featuredProductsTag?.products?.products?.length || 0;
            return (
              <FeaturedItems
                key={i}
                data={e.featuredProductsTag?.products}
                itemsQuantity={productsTagCount}
              />
            );
          case "HERO_TYPE_FEATURED_ARCHIVE":
            return (
              <HeroArchive
                entity={e}
                key={i}
                className="space-y-12 pt-16 lg:py-32"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

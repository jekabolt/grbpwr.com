"use client";

import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
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
              <div className="relative h-screen w-full" key={i}>
                <AnimatedButton
                  href={e.single?.exploreLink || ""}
                  className="group relative h-full w-full text-bgColor"
                >
                  <div className="hidden h-full lg:block">
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
                      fit="cover"
                    />
                  </div>
                  <div className="block h-full lg:hidden">
                    <Image
                      src={
                        e.single?.mediaPortrait?.media?.fullSize?.mediaUrl || ""
                      }
                      alt="ad hero image"
                      aspectRatio={calculateAspectRatio(
                        e.single?.mediaPortrait?.media?.fullSize?.width,
                        e.single?.mediaPortrait?.media?.fullSize?.height,
                      )}
                      fit="cover"
                    />
                  </div>
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
                    <Text
                      variant="uppercase"
                      className={cn("w-full text-center", {
                        "group-hover:underline":
                          !e.single?.exploreText && e.single?.exploreLink,
                      })}
                    >
                      {e.single?.headline}
                    </Text>
                    <Text variant="uppercase" className="group-hover:underline">
                      {e.single?.exploreText}
                    </Text>
                  </div>
                </AnimatedButton>
                <Overlay cover="container" disablePointerEvents />
              </div>
            );
          case "HERO_TYPE_DOUBLE":
            return (
              <div
                key={i}
                className="relative flex h-full w-full flex-col lg:flex-row"
              >
                <AnimatedButton
                  href={e.double?.left?.exploreLink || ""}
                  className="group relative h-full w-full text-bgColor"
                >
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
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6">
                    <Text
                      variant="uppercase"
                      className={cn({
                        "group-hover:underline": !e.double?.left?.exploreText,
                      })}
                    >
                      {e.double?.left?.headline}
                    </Text>
                    <Text className="uppercase group-hover:underline">
                      {e.double?.left?.exploreText}
                    </Text>
                  </div>
                </AnimatedButton>
                <AnimatedButton
                  href={e.double?.right?.exploreLink || ""}
                  className="group relative h-full w-full"
                >
                  <Image
                    src={
                      e.double?.right?.mediaLandscape?.media?.fullSize
                        ?.mediaUrl || ""
                    }
                    alt="ad hero image"
                    aspectRatio={calculateAspectRatio(
                      e.double?.right?.mediaLandscape?.media?.fullSize?.width,
                      e.double?.right?.mediaLandscape?.media?.fullSize?.height,
                    )}
                    fit="contain"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 text-bgColor">
                    <Text
                      variant="uppercase"
                      className={cn({
                        "group-hover:underline": !e.double?.right?.exploreText,
                      })}
                    >
                      {e.double?.right?.headline}
                    </Text>
                    <Text className="uppercase group-hover:underline">
                      {e.double?.right?.exploreText}
                    </Text>
                  </div>
                </AnimatedButton>
                <Overlay cover="container" disablePointerEvents />
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

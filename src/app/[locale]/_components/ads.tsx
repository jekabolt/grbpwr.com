"use client";

import type { common_HeroEntityWithTranslations } from "@/api/proto-http/frontend";

import { sendHeroEvent } from "@/lib/analitycs/hero";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { FeaturedItems } from "./featured-items";
import { HeroArchive } from "./hero-archive";

export function Ads({
  entities,
}: {
  entities: common_HeroEntityWithTranslations[];
}) {
  const { languageId } = useTranslationsStore((state) => state);
  return (
    <div>
      {entities?.map((e, i) => {
        // Prioritize first ad for better LCP
        const isPriorityAd = i === 0;
        switch (e.type) {
          case "HERO_TYPE_SINGLE":
            const currentTranslation = e.single?.translations?.find(
              (t) => t.languageId === languageId,
            );
            return (
              <div className="relative h-screen w-full" key={i}>
                <AnimatedButton
                  href={e.single?.exploreLink || ""}
                  className="group relative h-full w-full text-bgColor"
                  onClick={() =>
                    sendHeroEvent({ heroType: "HERO_TYPE_SINGLE" })
                  }
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
                      priority={isPriorityAd}
                      loading={isPriorityAd ? "eager" : "lazy"}
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
                      priority={isPriorityAd}
                      loading={isPriorityAd ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
                    <Text
                      variant="uppercase"
                      className={cn("w-full text-center", {
                        "group-hover:underline":
                          !currentTranslation?.exploreText &&
                          e.single?.exploreLink,
                      })}
                    >
                      {currentTranslation?.headline}
                    </Text>
                    <Text variant="uppercase" className="group-hover:underline">
                      {currentTranslation?.exploreText}
                    </Text>
                  </div>
                </AnimatedButton>
                <Overlay cover="container" disablePointerEvents />
              </div>
            );
          case "HERO_TYPE_DOUBLE":
            const leftTranslation = e.double?.left?.translations?.find(
              (t) => t.languageId === languageId,
            );
            const rightTranslation = e.double?.right?.translations?.find(
              (t) => t.languageId === languageId,
            );
            return (
              <div
                key={i}
                className="relative flex h-full w-full flex-col lg:flex-row"
              >
                <AnimatedButton
                  href={e.double?.left?.exploreLink || ""}
                  className="group relative h-full w-full text-bgColor"
                  onClick={() =>
                    sendHeroEvent({ heroType: "HERO_TYPE_DOUBLE_LEFT" })
                  }
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
                    priority={isPriorityAd}
                    loading={isPriorityAd ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6">
                    <Text
                      variant="uppercase"
                      className={cn({
                        "group-hover:underline": !leftTranslation?.exploreText,
                      })}
                    >
                      {leftTranslation?.headline}
                    </Text>
                    <Text className="uppercase group-hover:underline">
                      {leftTranslation?.exploreText}
                    </Text>
                  </div>
                </AnimatedButton>
                <AnimatedButton
                  href={e.double?.right?.exploreLink || ""}
                  className="group relative h-full w-full"
                  onClick={() =>
                    sendHeroEvent({ heroType: "HERO_TYPE_DOUBLE_RIGHT" })
                  }
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
                    priority={isPriorityAd}
                    loading={isPriorityAd ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 text-bgColor">
                    <Text
                      variant="uppercase"
                      className={cn({
                        "group-hover:underline": !rightTranslation?.exploreText,
                      })}
                    >
                      {rightTranslation?.headline}
                    </Text>
                    <Text className="uppercase group-hover:underline">
                      {rightTranslation?.exploreText}
                    </Text>
                  </div>
                </AnimatedButton>
                <Overlay cover="container" disablePointerEvents />
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS":
            const itemsQuantity = e.featuredProducts?.products?.length || 0;
            const productsTranslation = e.featuredProducts?.translations?.find(
              (t) => t.languageId === languageId,
            );
            return (
              <FeaturedItems
                key={i}
                products={e.featuredProducts?.products}
                headline={productsTranslation?.headline}
                exploreText={productsTranslation?.exploreText}
                exploreLink={e.featuredProducts?.exploreLink}
                itemsQuantity={itemsQuantity}
                onHeroClick={() =>
                  sendHeroEvent({ heroType: "HERO_TYPE_FEATURED_PRODUCTS" })
                }
              />
            );
          case "HERO_TYPE_FEATURED_PRODUCTS_TAG":
            const productsTagCount =
              e.featuredProductsTag?.products?.products?.length || 0;
            const productsTagTranslation =
              e.featuredProductsTag?.translations?.find(
                (t) => t.languageId === languageId,
              );
            return (
              <FeaturedItems
                key={i}
                products={e.featuredProductsTag?.products?.products}
                headline={productsTagTranslation?.headline}
                exploreText={productsTagTranslation?.exploreText}
                exploreLink={e.featuredProductsTag?.products?.exploreLink}
                itemsQuantity={productsTagCount}
                onHeroClick={() =>
                  sendHeroEvent({ heroType: "HERO_TYPE_FEATURED_PRODUCTS_TAG" })
                }
              />
            );
          case "HERO_TYPE_FEATURED_ARCHIVE":
            return (
              <HeroArchive
                entity={e}
                key={i}
                className="space-y-12 pt-16 lg:py-32"
                onHeroClick={() =>
                  sendHeroEvent({ heroType: "HERO_TYPE_FEATURED_ARCHIVE" })
                }
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

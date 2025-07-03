"use client";

import Link from "next/link";
import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { HeroArchive } from "./hero-archive";
import { ProductItem } from "./product-item";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  // Remove the global carousel setup since we'll use it per section
  // const [emblaRef, emblaApi] = useEmblaCarousel(
  //   {
  //     loop: true,
  //     // dragFree: true,
  //   },
  //   [WheelGesturesPlugin()],
  // );

  return (
    <div className="pb-10">
      {entities?.map((e, i) => {
        switch (e.type) {
          case "HERO_TYPE_SINGLE":
            return (
              <div className="relative h-full w-full" key={i}>
                <div className="relative h-full w-full">
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
                        e.single?.mediaPortrait?.media?.fullSize?.mediaUrl || ""
                      }
                      alt="ad hero image"
                      aspectRatio={calculateAspectRatio(
                        e.single?.mediaPortrait?.media?.fullSize?.width,
                        e.single?.mediaPortrait?.media?.fullSize?.height,
                      )}
                      fit="contain"
                    />
                  </div>
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-6">
                    <Text variant="uppercase" className="text-white">
                      {e.single?.headline}
                    </Text>
                    <Button
                      variant="underline"
                      className="uppercase text-white"
                      asChild
                    >
                      <Link href={e.single?.exploreLink || ""}>
                        {e.single?.exploreText}
                      </Link>
                    </Button>
                  </div>
                </div>
                <Overlay cover="container" />
              </div>
            );
          case "HERO_TYPE_DOUBLE":
            return (
              <div
                key={i}
                className="relative flex h-full w-full flex-col lg:flex-row"
              >
                <div className="relative h-full w-full">
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
                    <Text variant="uppercase" className="text-white">
                      {e.double?.left?.headline}
                    </Text>
                    <Button
                      variant="underline"
                      className="uppercase text-white"
                      asChild
                    >
                      <Link href={e.double?.left?.exploreLink || ""}>
                        {e.double?.left?.exploreText}
                      </Link>
                    </Button>
                  </div>
                </div>
                <div
                  key={e.double?.right?.mediaLandscape?.id}
                  className="relative h-full w-full"
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
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6">
                    <Text variant="uppercase" className="text-white">
                      {e.double?.right?.headline}
                    </Text>
                    <Button
                      variant="underline"
                      className="uppercase text-white"
                      asChild
                    >
                      <Link href={e.double?.right?.exploreLink || ""}>
                        {e.double?.right?.exploreText}
                      </Link>
                    </Button>
                  </div>
                </div>
                <Overlay cover="container" />
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS":
            const featuredProductsCount =
              e.featuredProducts?.products?.length || 0;
            const enableScrollOnMobileFP = featuredProductsCount >= 3;
            const enableScrollOnDesktopFP = featuredProductsCount > 4;

            return (
              <div className="space-y-12 pb-16 pt-6 lg:py-28 lg:pl-2" key={i}>
                <div className="flex flex-col gap-3 px-2 lg:flex-row lg:px-0">
                  <Text variant="uppercase">
                    {e.featuredProducts?.headline}
                  </Text>
                  <Button variant="underline" className="uppercase" asChild>
                    <Link href={e.featuredProducts?.exploreLink || ""}>
                      {e.featuredProducts?.exploreText}
                    </Link>
                  </Button>
                </div>

                <div
                  // ref={autoScroll}
                  // onScroll={handleScroll}
                  className={cn(
                    "flex w-full items-center justify-center gap-2.5",
                    {
                      "overflow-x-scroll": enableScrollOnMobileFP,
                      "justify-start lg:overflow-x-scroll":
                        enableScrollOnDesktopFP,
                    },
                  )}
                >
                  {e.featuredProducts?.products?.map((p, index) => (
                    <ProductItem
                      className="scroll-snap-start w-40 shrink-0 lg:w-72"
                      key={p.id}
                      product={p}
                    />
                  ))}
                </div>
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS_TAG":
            const tagProductsCount =
              e.featuredProductsTag?.products?.products?.length || 0;
            return (
              <div className="space-y-6 py-6 lg:pl-2" key={i}>
                <div className="flex flex-row gap-3 px-2 lg:flex-row lg:px-0">
                  <Text variant="uppercase">
                    {e.featuredProductsTag?.products?.headline}
                  </Text>
                  <Button variant="underline" className="uppercase" asChild>
                    <Link href={`/catalog?tag=${e.featuredProductsTag?.tag}`}>
                      {e.featuredProductsTag?.products?.exploreText}
                    </Link>
                  </Button>
                </div>
                <Carousel
                  loop={{
                    mobile: tagProductsCount >= 3,
                    desktop: tagProductsCount > 4,
                  }}
                  disabled={{
                    mobile: tagProductsCount < 3,
                    desktop: tagProductsCount <= 4,
                  }}
                  align={{
                    mobile: "center",
                    desktop: "start",
                  }}
                  className={cn("flex gap-2.5", {
                    "lg:justify-center": tagProductsCount <= 4,
                    "lg:gap-10": tagProductsCount === 2,
                  })}
                >
                  {e.featuredProductsTag?.products?.products?.map((p) => (
                    <ProductItem
                      key={p.id}
                      className={cn("flex-[0_0_45%] lg:flex-[0_0_25%]", {
                        "w-72 lg:w-[32rem]": tagProductsCount === 1,
                        "lg:w-[32rem]": tagProductsCount === 2,
                        "flex-[0_0_50%] lg:w-[24rem]": tagProductsCount === 3,
                        "lg:w-80": tagProductsCount === 4,
                        "lg:w-96": tagProductsCount > 5,
                      })}
                      product={p}
                    />
                  ))}
                </Carousel>
              </div>
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

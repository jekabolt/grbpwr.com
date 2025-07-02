"use client";

import Link from "next/link";
import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { HeroArchive } from "./hero-archive";
import { ProductItem } from "./product-item";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  const autoScroll = (node: HTMLDivElement | null) => {
    if (node && window.innerWidth < 1024) {
      const hasOverflow = node.classList.contains("overflow-x-scroll");
      if (hasOverflow) {
        setTimeout(() => {
          if (!node.dataset.userScrolled) {
            node.scrollTo({ left: 50, behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.currentTarget.dataset.userScrolled = "true";
  };

  return (
    <div>
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
                  ref={autoScroll}
                  onScroll={handleScroll}
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
              <div className="space-y-6 py-6 lg:py-28 lg:pl-2" key={i}>
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
                <div
                  ref={autoScroll}
                  onScroll={handleScroll}
                  className={cn("flex w-full items-center gap-2.5", {
                    "justify-center gap-7 lg:gap-40":
                      tagProductsCount === 1 || tagProductsCount === 2,
                    "justify-start overflow-x-scroll lg:justify-center lg:overflow-x-visible":
                      tagProductsCount === 3 || tagProductsCount === 4,
                    "justify-start overflow-x-scroll": tagProductsCount > 4,
                  })}
                >
                  {e.featuredProductsTag?.products?.products?.map((p) => (
                    <ProductItem
                      className={cn(
                        "flex-basis mx-auto w-40 shrink-0 lg:w-72",
                        {
                          "w-72 lg:w-[32rem]": tagProductsCount === 1,
                          "lg:w-[32rem]": tagProductsCount === 2,
                          "lg:w-[24rem]": tagProductsCount === 3,
                        },
                      )}
                      key={p.id}
                      product={p}
                    />
                  ))}
                </div>
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

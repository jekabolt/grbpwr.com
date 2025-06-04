"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { HeroArchive } from "./hero-archive";
import { ProductItem } from "./product-item";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  const productsRef = useRef<HTMLDivElement>(null);
  const productsTagRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(new Set<HTMLDivElement>());
  const userScrolledRef = useRef(new Set<HTMLDivElement>());

  const handleUserScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    userScrolledRef.current.add(container);
  };

  useEffect(() => {
    const scrollContainers = [
      { ref: productsRef, scrollAmount: 50, mobileOnly: true },
      { ref: productsTagRef, scrollAmount: 50, mobileOnly: true },
    ];

    const scrollToFirstItem = () => {
      const isMobile = window.innerWidth < 1024;

      scrollContainers.forEach(({ ref, scrollAmount, mobileOnly }) => {
        const container = ref.current;
        if (
          container?.children.length &&
          (!mobileOnly || isMobile) &&
          !hasScrolledRef.current.has(container) &&
          !userScrolledRef.current.has(container)
        ) {
          container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
          });
          hasScrolledRef.current.add(container);
        }
      });
    };

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        scrollContainers.forEach(({ ref }) => {
          const container = ref.current;
          if (container && !userScrolledRef.current.has(container)) {
            hasScrolledRef.current.delete(container);
          }
        });
        setTimeout(scrollToFirstItem, 100);
      }
    };

    setTimeout(scrollToFirstItem, 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                  ref={productsRef}
                  onScroll={handleUserScroll}
                  className="flex w-full gap-2 overflow-x-scroll"
                >
                  {e.featuredProducts?.products?.map((p) => (
                    <ProductItem
                      className="w-40 lg:w-72"
                      key={p.id}
                      product={p}
                    />
                  ))}
                </div>
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS_TAG":
            return (
              <div className="space-y-12 pb-16 pt-6 lg:py-28 lg:pl-2" key={i}>
                <div className="flex flex-col gap-3 px-2 lg:flex-row lg:px-0">
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
                  ref={productsTagRef}
                  onScroll={handleUserScroll}
                  className="flex w-full items-center gap-2.5 overflow-x-scroll"
                >
                  {e.featuredProductsTag?.products?.products?.map((p) => (
                    <ProductItem
                      className="w-40 lg:w-72"
                      key={p.id}
                      product={p}
                    />
                  ))}
                </div>
              </div>
            );
          case "HERO_TYPE_FEATURED_ARCHIVE":
            return (
              <HeroArchive entity={e} key={i} className="pt-16 lg:py-32" />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

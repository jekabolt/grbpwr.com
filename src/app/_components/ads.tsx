"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { ArchiveItem } from "./archive-item";
import { ProductItem } from "./product-item";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  const productsRef = useRef<HTMLDivElement>(null);
  const productsTagRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  // This keeps track of containers that have been auto-scrolled
  const hasScrolledRef = useRef(new Set<HTMLDivElement>());
  // This keeps track of containers that the user has manually scrolled
  const userScrolledRef = useRef(new Set<HTMLDivElement>());
  const isInitialMountRef = useRef(true);

  // Handle user scroll events on a container.
  const handleUserScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    userScrolledRef.current.add(container);
  };

  useEffect(() => {
    if (!isInitialMountRef.current) {
      return;
    }
    isInitialMountRef.current = false;

    const scrollContainers = [
      { ref: productsRef, scrollAmount: 50, mobileOnly: true },
      { ref: productsTagRef, scrollAmount: 50, mobileOnly: true },
      { ref: archiveRef, scrollAmount: 200, mobileOnly: false },
    ];

    const scrollToFirstItem = () => {
      const isMobile = window.innerWidth < 1024;

      scrollContainers.forEach(({ ref, scrollAmount, mobileOnly }) => {
        const container = ref.current;
        // Only auto-scroll if the container has children, meets the screen check,
        // hasn't been auto scrolled already, and hasn't been manually scrolled.
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
        // For any container that the user hasn't scrolled manually,
        // clear the auto-scroll flag so that we might auto-scroll them again.
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
              <div className="relative h-screen w-full" key={i}>
                <div
                  key={e.single?.mediaLandscape?.id}
                  className="relative h-full w-full"
                >
                  <Image
                    src={
                      e.single?.mediaLandscape?.media?.fullSize?.mediaUrl || ""
                    }
                    alt="ad hero image"
                    aspectRatio={calculateAspectRatio(
                      e.single?.mediaLandscape?.media?.fullSize?.width,
                      e.single?.mediaLandscape?.media?.fullSize?.height,
                    )}
                    fit="cover"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6">
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
                <div className="absolute inset-0 z-10 h-screen bg-black opacity-40"></div>
              </div>
            );
          case "HERO_TYPE_DOUBLE":
            return (
              <div
                key={i}
                className="relative flex h-screen w-full flex-col lg:flex-row"
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
                    fit="cover"
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
                    fit="cover"
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
                <div className="absolute inset-0 z-10 h-screen bg-overlay"></div>
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS":
            return (
              <div className="space-y-10 pb-16 pt-6 lg:py-20 lg:pl-2" key={i}>
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
                  className="no-scroll-bar flex w-full items-center gap-2 overflow-x-scroll"
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
              <div className="space-y-10 pb-16 pt-6 lg:py-20 lg:pl-2" key={i}>
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
                  className="no-scroll-bar flex w-full items-center gap-2.5 overflow-x-scroll"
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
              <div className="space-y-10 pb-16 pt-6 lg:py-20 lg:pl-2" key={i}>
                <div className="flex flex-col gap-3 px-2 lg:flex-row lg:px-0">
                  <Text variant="uppercase">{e.featuredArchive?.headline}</Text>
                  <Button variant="underline" className="uppercase" asChild>
                    <Link href={`/archive/${e.featuredArchive?.tag}`}>
                      {e.featuredArchive?.exploreText}
                    </Link>
                  </Button>
                </div>
                <div
                  ref={archiveRef}
                  onScroll={handleUserScroll}
                  className="no-scroll-bar flex w-full items-center overflow-x-scroll"
                >
                  <ArchiveItem
                    archive={e.featuredArchive?.archive}
                    className="w-80 lg:w-96"
                  />
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { ProductItem } from "./product-item";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollMiddle = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = scrollMiddle;
    }
  }, []);

  return (
    <div>
      {entities?.map((e, i) => {
        switch (e.type) {
          case "HERO_TYPE_SINGLE":
            return (
              <div className="relative h-screen w-full">
                <div
                  key={e.single?.media?.id}
                  className="relative h-full w-full"
                >
                  <Image
                    src={e.single?.media?.media?.fullSize?.mediaUrl || ""}
                    alt="ad hero image"
                    aspectRatio={calculateAspectRatio(
                      e.single?.media?.media?.fullSize?.width,
                      e.single?.media?.media?.fullSize?.height,
                    )}
                    fit="cover"
                  />
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-6">
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
                <div className="z-5 absolute inset-0 h-screen bg-black opacity-40"></div>
              </div>
            );
          case "HERO_TYPE_DOUBLE":
            return (
              <div
                key={e.double?.left?.media?.id}
                className="relative flex h-screen w-full flex-col lg:flex-row"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={e.double?.left?.media?.media?.fullSize?.mediaUrl || ""}
                    alt="ad hero image"
                    aspectRatio={calculateAspectRatio(
                      e.double?.left?.media?.media?.fullSize?.width,
                      e.double?.left?.media?.media?.fullSize?.height,
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
                  key={e.double?.right?.media?.id}
                  className="relative h-full w-full"
                >
                  <Image
                    src={
                      e.double?.right?.media?.media?.fullSize?.mediaUrl || ""
                    }
                    alt="ad hero image"
                    aspectRatio={calculateAspectRatio(
                      e.double?.right?.media?.media?.fullSize?.width,
                      e.double?.right?.media?.media?.fullSize?.height,
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
                <div className="bg-overlay absolute inset-0 z-10 h-screen"></div>
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS":
            return (
              <div className="space-y-10 pb-16 pt-6 lg:py-20 lg:pl-2">
                <div className="flex gap-3 px-2 lg:px-0">
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
                  ref={scrollContainerRef}
                  className="no-scroll-bar mx-auto flex max-w-full items-center gap-2.5 overflow-x-scroll"
                >
                  {e.featuredProducts?.products?.map((p) => (
                    <ProductItem className="h-96 w-72" key={p.id} product={p} />
                  ))}
                </div>
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS_TAG":
            return (
              <div className="space-y-10 pb-16 pt-6 lg:py-20 lg:pl-2">
                <div className="flex gap-3 px-2 lg:px-0">
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
                  ref={scrollContainerRef}
                  className="no-scroll-bar mx-auto flex max-w-full items-center gap-2.5 overflow-x-scroll"
                >
                  {e.featuredProductsTag?.products?.products?.map((p) => (
                    <ProductItem className="h-96 w-72" key={p.id} product={p} />
                  ))}
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

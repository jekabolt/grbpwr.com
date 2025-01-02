"use client";

import Link from "next/link";
import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { ProductItem } from "./product-item";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  return (
    <div className="space-y-20">
      {entities?.map((e, i) => {
        switch (e.type) {
          case "HERO_TYPE_SINGLE":
            return (
              <div key={e.single?.media?.id} className="h-[600px]">
                <Image
                  src={e.single?.media?.media?.fullSize?.mediaUrl || ""}
                  alt="ad hero image"
                  aspectRatio={calculateAspectRatio(
                    e.single?.media?.media?.fullSize?.width,
                    e.single?.media?.media?.fullSize?.height,
                  )}
                  // blurHash={media.media?.blurhash}
                />
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
                    // blurHash={media.media?.blurhash}
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
                <div className="absolute inset-0 z-[1] h-screen bg-black opacity-40"></div>
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS":
            return (
              // <ProductsGrid key={i} products={e.featuredProducts?.products} />
              <div className="space-y-10">
                <div className="flex flex-col gap-2 md:flex-row">
                  <Text variant="uppercase">
                    {e.featuredProducts?.headline}
                  </Text>
                  <Button variant="underline" className="uppercase" asChild>
                    <Link href={e.featuredProducts?.exploreLink || ""}>
                      {e.featuredProducts?.exploreText}
                    </Link>
                  </Button>
                </div>
                <div className="no-scroll-bar flex gap-10 overflow-x-scroll">
                  {e.featuredProducts?.products?.map((p) => (
                    <ProductItem className="w-[282px]" key={p.id} product={p} />
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

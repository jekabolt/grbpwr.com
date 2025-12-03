"use client";

import { useRef } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselRef } from "@/components/ui/carousel";
import { Arrow } from "@/components/ui/icons/arrow";
import ImageComponent from "@/components/ui/image";

export function ProductImagesCarousel({ productMedia }: Props) {
  const carouselRef = useRef<CarouselRef>(null);
  const oneMedia = productMedia.length === 1;

  const mediaForCarousel =
    productMedia.length <= 3 && productMedia.length > 1
      ? [...productMedia, ...productMedia]
      : productMedia;

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 z-50 -translate-y-1/2 leading-none">
        <Button onClick={() => carouselRef.current?.scrollPrev()}>
          <Arrow className="rotate-[-90deg]" />
        </Button>
      </div>

      <Carousel
        ref={carouselRef}
        loop={productMedia.length > 1}
        align={oneMedia ? "start" : "end"}
        startIndex={oneMedia ? 0 : 2}
        className="flex h-screen w-full pt-14"
        scrollOnClick={true}
      >
        {mediaForCarousel.map((m, index) => (
          <div
            key={`${m.id}-${index}`}
            className="h-full w-full flex-[0_0_48%]"
          >
            <ImageComponent
              src={m?.media?.fullSize?.mediaUrl!}
              alt="Product image"
              aspectRatio={calculateAspectRatio(
                m?.media?.fullSize?.width,
                m?.media?.fullSize?.height,
              )}
              fit="contain"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

type Props = {
  className?: string;
  productMedia: common_MediaFull[];
};

"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";

import { Carousel } from "@/components/ui/carousel";
import ImageComponent from "@/components/ui/image";
import { calculateAspectRatio } from "@/lib/utils";

export function ProductImagesCarousel({ productMedia }: Props) {
  const oneMedia = productMedia.length === 1;

  const mediaForCarousel =
    productMedia.length <= 3 && productMedia.length > 1
      ? [...productMedia, ...productMedia]
      : productMedia;

  return (
    <div className="relative h-full">
      <Carousel
        loop={productMedia.length > 1}
        align={oneMedia ? "start" : "end"}
        startIndex={oneMedia ? 0 : 2}
        className="flex h-screen w-full pt-14"
        scrollOnClick={true}
      >
        {mediaForCarousel.map((m, index) => {
          // Prioritize first 2 images for LCP optimization
          const isPriority = index < 2;
          return (
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
                priority={isPriority}
                loading={isPriority ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

type Props = {
  className?: string;
  productMedia: common_MediaFull[];
};

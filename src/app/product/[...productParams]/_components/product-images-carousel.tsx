"use client";

import { useCallback, useEffect } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import useEmblaCarousel from "embla-carousel-react";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons/arrow-right";
import ImageComponent from "@/components/ui/image";

export function ProductImagesCarousel({ productMedia }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: productMedia.length > 1,
    align: "end",
    containScroll: false,
  });

  const mediaForCarousel =
    productMedia.length === 2
      ? [...productMedia, ...productMedia]
      : productMedia;

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        scrollNext();
      } else if (event.key === "ArrowLeft") {
        scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollNext, scrollPrev]);

  return (
    <div
      className="hidden w-full overflow-x-auto border border-blue-500 lg:block"
      ref={emblaRef}
    >
      <div className="flex h-full">
        {mediaForCarousel.map((m, index) => (
          <div key={`${m.id}-${index}`} className="flex-[0_0_660px]">
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
      </div>
      <Button
        className="absolute left-32 top-0 h-full w-4 rotate-180"
        onClick={scrollPrev}
      >
        <ArrowRight />
      </Button>
      <Button
        className="absolute right-32 top-0 h-full w-4"
        onClick={scrollNext}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}

type Props = {
  className?: string;
  productMedia: common_MediaFull[];
};

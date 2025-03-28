"use client";

import { useCallback, useEffect } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/ui/icons/arrow";
import ImageComponent from "@/components/ui/image";

export function ProductImagesCarousel({ productMedia }: Props) {
  const oneMedia = productMedia.length === 1;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: productMedia.length > 1,
      align: oneMedia ? "start" : "end",
      containScroll: "trimSnaps",
      startIndex: oneMedia ? 0 : 2,
    },
    [WheelGesturesPlugin()],
  );

  const mediaForCarousel =
    productMedia.length <= 3 && productMedia.length > 1
      ? [...productMedia, ...productMedia]
      : productMedia;

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        scrollNext();
      } else if (event.key === "ArrowLeft") {
        scrollPrev();
      }
    },
    [scrollNext, scrollPrev],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="h-full w-full touch-pan-x overflow-x-auto" ref={emblaRef}>
      <div className="flex h-full">
        {mediaForCarousel.map((m, index) => (
          <div key={`${m.id}-${index}`} className="flex-[0_0_45%]">
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
      {!oneMedia && (
        <>
          <Button
            className="absolute left-32 top-0 h-full w-4 rotate-180"
            onClick={scrollPrev}
          >
            <Arrow />
          </Button>
          <Button
            className="absolute right-32 top-0 h-full w-4"
            onClick={scrollNext}
          >
            <Arrow />
          </Button>
        </>
      )}
    </div>
  );
}

type Props = {
  className?: string;
  productMedia: common_MediaFull[];
};

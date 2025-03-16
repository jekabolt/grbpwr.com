"use client";

import { useEffect } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import useEmblaCarousel from "embla-carousel-react";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/ui/icons/arrow";
import ImageComponent from "@/components/ui/image";

export function ProductImagesCarousel({ productMedia }: Props) {
  const oneMedia = productMedia.length === 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: productMedia.length > 1,
    align: oneMedia ? "start" : "end",
    containScroll: "trimSnaps",
    startIndex: oneMedia ? 0 : 2,
  });

  const mediaForCarousel =
    productMedia.length <= 3 && productMedia.length > 1
      ? [...productMedia, ...productMedia]
      : productMedia;

  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      scrollNext();
    } else if (event.key === "ArrowLeft") {
      scrollPrev();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    let accumulatedDeltaX = 0;
    const scrollThreshold = 200;

    const handleWheel = (event: WheelEvent) => {
      if (emblaApi) {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          event.preventDefault();

          accumulatedDeltaX += event.deltaX;

          if (accumulatedDeltaX > scrollThreshold) {
            emblaApi.scrollNext();
            accumulatedDeltaX = 0;
          } else if (accumulatedDeltaX < -scrollThreshold) {
            emblaApi.scrollPrev();
            accumulatedDeltaX = 0;
          }
        }
      }
    };

    if (emblaApi) {
      const rootNode = emblaApi.rootNode();
      rootNode.style.overflowX = "auto";
      rootNode.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (emblaApi) {
        const rootNode = emblaApi.rootNode();
        rootNode.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleKeyDown, emblaApi]);

  return (
    <div
      className="no-scroll-bar h-full w-full touch-pan-x overflow-x-auto"
      ref={emblaRef}
    >
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

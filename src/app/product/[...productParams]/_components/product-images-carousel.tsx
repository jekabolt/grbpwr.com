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
    containScroll: false,
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
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="no-scroll-bar h-full w-full overflow-x-auto" ref={emblaRef}>
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

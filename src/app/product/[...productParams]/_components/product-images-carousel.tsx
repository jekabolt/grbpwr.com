"use client";

import { useCallback } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import useEmblaCarousel from "embla-carousel-react";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons/arrow-right";
import ImageComponent from "@/components/ui/image";

export function ProductImagesCarousel({ productMedia, className }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: productMedia.length > 1,
    align: "end",
    containScroll: false,
  });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const mediaForCarousel =
    productMedia.length === 2
      ? [...productMedia, ...productMedia]
      : productMedia;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="w-full overflow-hidden border border-blue-500"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {mediaForCarousel.map((m, index) => (
            <div key={`${m.id}-${index}`} className="flex-[0_0_660px]">
              <MobileSlide media={m} />
              <DesktopSlide media={m} />
            </div>
          ))}
        </div>
      </div>
      <Button
        className="absolute right-32 top-0 h-full w-4"
        onClick={scrollNext}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}

function MobileSlide({ media }: { media: common_MediaFull }) {
  return (
    <div className="w-full lg:hidden">
      <ImageComponent
        src={media?.media?.fullSize?.mediaUrl!}
        alt="Product image"
        aspectRatio={calculateAspectRatio(
          media?.media?.fullSize?.width,
          media?.media?.fullSize?.height,
        )}
        fit="contain"
      />
    </div>
  );
}

function DesktopSlide({ media }: { media: common_MediaFull }) {
  return (
    <div className="hidden w-full lg:block">
      <ImageComponent
        src={media?.media?.fullSize?.mediaUrl!}
        alt="Product image"
        aspectRatio={calculateAspectRatio(
          media?.media?.fullSize?.width,
          media?.media?.fullSize?.height,
        )}
        fit="contain"
      />
    </div>
  );
}

type Props = {
  className?: string;
  productMedia: common_MediaFull[];
};

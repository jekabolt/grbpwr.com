"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import useEmblaCarousel from "embla-carousel-react";

import { calculateAspectRatio, cn } from "@/lib/utils";
import GlobalImage from "@/components/ui/image";

export function ProductImagesCarousel({ productMedia, className }: Props) {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className={cn("relative overflow-hidden", className)} ref={emblaRef}>
      <div className="flex lg:h-full">
        {productMedia.map((m) => (
          <div key={m.id} className="min-w-full lg:min-w-[70%]">
            <MobileSlide media={m} />
            <DesktopSlide media={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileSlide({ media }: { media: common_MediaFull }) {
  return (
    <div className="min-w-full lg:hidden">
      <GlobalImage
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
    <div className="hidden h-full lg:block">
      <GlobalImage
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

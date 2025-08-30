import { forwardRef } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Carousel, CarouselRef } from "@/components/ui/carousel";
import ImageComponent from "@/components/ui/image";

export const MobileImageCarousel = forwardRef<
  CarouselRef,
  { media: common_MediaFull[] }
>(function MobileImageCarousel({ media }, ref) {
  return (
    <Carousel
      ref={ref}
      loop
      align="center"
      className="flex h-full w-full"
      scrollOnClick
      dragFree={false}
    >
      {media.map((m, index) => (
        <div key={`${m.id}-${index}`} className="flex-[0_0_100%]">
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
  );
});

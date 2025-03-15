"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";

export function MobileImageCarousel({ media }: { media: common_MediaFull[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
  });
  return (
    <DialogPrimitives.Root modal={true}>
      <DialogPrimitives.Trigger asChild>
        <div className="h-full w-full overflow-x-hidden" ref={emblaRef}>
          <div className="flex h-full">
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
          </div>
        </div>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-30 bg-black/50" />
        <DialogPrimitives.Content className="no-scroll-bar fixed inset-0 z-30 flex flex-col overflow-y-auto bg-white">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>

          <DialogPrimitives.Close asChild>
            <Button className="absolute right-4 top-4 z-40">[x]</Button>
          </DialogPrimitives.Close>

          <DialogPrimitives.Close asChild>
            <div className="grid">
              {media.map((item) => (
                <div key={item.id} className="w-full">
                  <ImageComponent
                    src={item.media?.fullSize?.mediaUrl || ""}
                    alt={item.media?.fullSize?.mediaUrl || "Product thumbnail"}
                    aspectRatio={calculateAspectRatio(
                      item.media?.fullSize?.width,
                      item.media?.fullSize?.height,
                    )}
                  />
                </div>
              ))}
            </div>
          </DialogPrimitives.Close>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

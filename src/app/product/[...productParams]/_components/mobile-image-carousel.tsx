import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import ImageComponent from "@/components/ui/image";

export function MobileImageCarousel({
  media,
  onScrollStart,
  onScrollEnd,
}: {
  media: common_MediaFull[];
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
}) {
  return (
    <DialogPrimitives.Root modal={true}>
      <DialogPrimitives.Trigger asChild>
        <div>
          <Carousel
            loop
            align="center"
            className="flex h-full w-full"
            dragFree={false}
            onScrollStart={onScrollStart}
            onScrollEnd={onScrollEnd}
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
        </div>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitives.Content className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>

          <DialogPrimitives.Close asChild>
            <Button className="absolute right-4 top-4 z-50">[x]</Button>
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

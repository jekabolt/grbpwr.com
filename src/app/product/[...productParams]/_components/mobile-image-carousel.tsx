import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";

export function MobileImageCarousel({ media }: { media: common_MediaFull[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
      skipSnaps: true,
      align: "center",
      axis: "x",
      startIndex: 0,
    },
    [WheelGesturesPlugin()],
  );

  function scrollNext() {
    emblaApi?.scrollNext(true);
  }

  function scrollPrev() {
    emblaApi?.scrollPrev(true);
  }

  return (
    <DialogPrimitives.Root modal>
      <div ref={emblaRef} className="relative overflow-hidden">
        <div className="flex h-full w-full">
          {media.map((m, index) => (
            <div key={`${m.id}-${index}`} className="h-full flex-[0_0_102%]">
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
        <div className="absolute inset-0 flex text-bgColor mix-blend-exclusion">
          <AnimatedButton
            animationDuration={300}
            animationArea="text-no-underline"
            onClick={scrollPrev}
            className="flex w-20 flex-col items-start justify-end pl-2.5 text-bgColor"
          >
            {"<"}
          </AnimatedButton>
          <DialogPrimitives.Trigger asChild>
            <div className="flex-1" />
          </DialogPrimitives.Trigger>
          <AnimatedButton
            animationArea="text-no-underline"
            animationDuration={300}
            onClick={scrollNext}
            className="z-50 flex w-20 flex-col items-end justify-end pr-2.5 text-bgColor"
          >
            {">"}
          </AnimatedButton>
        </div>
      </div>

      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitives.Content className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>

          <DialogPrimitives.Close asChild>
            <Button className="fixed right-4 top-4 z-50">[x]</Button>
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

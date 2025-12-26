"use client";

import { useEffect, useRef, useState } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";

export function MobileImageCarousel({ media }: { media: common_MediaFull[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
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

  useEffect(() => {
    if (emblaApi) {
      const updateSelectedIndex = () => {
        const currentIndex = emblaApi.selectedScrollSnap();
        setSelectedIndex(currentIndex);
      };

      emblaApi.on("select", updateSelectedIndex);
      updateSelectedIndex(); // Set initial index

      return () => {
        emblaApi.off("select", updateSelectedIndex);
      };
    }
  }, [emblaApi]);

  useEffect(() => {
    if (isOpen && emblaApi) {
      // Update selected index when dialog opens
      setSelectedIndex(emblaApi.selectedScrollSnap());
      // Trigger animation when dialog opens
      setShouldAnimate(true);
      // Reset animation state after animation completes
      const animationTimer = setTimeout(() => setShouldAnimate(false), 400);
      return () => {
        clearTimeout(animationTimer);
      };
    } else {
      setShouldAnimate(false);
    }
  }, [isOpen, emblaApi]);

  function scrollNext() {
    emblaApi?.scrollNext(true);
  }

  function scrollPrev() {
    emblaApi?.scrollPrev(true);
  }

  return (
    <DialogPrimitives.Root modal open={isOpen} onOpenChange={setIsOpen}>
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
        <DialogPrimitives.Content
          className="fixed inset-0 z-50 flex flex-col bg-white pt-12"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>

          <DialogPrimitives.Close asChild>
            <Button className="fixed right-4 top-4 z-50">[x]</Button>
          </DialogPrimitives.Close>

          <div ref={dialogContentRef} className="flex flex-1 overflow-hidden">
            {media[selectedIndex] && (
              <TransformWrapper
                ref={transformRef}
                initialScale={1}
                minScale={1}
                maxScale={4}
                limitToBounds={true}
                wheel={{
                  step: 0.1,
                }}
                pinch={{
                  step: 10,
                }}
                doubleClick={{
                  disabled: false,
                  step: 2,
                }}
                key={media[selectedIndex].id}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center",
                  }}
                >
                  <div className="relative h-full flex-[0_0_100%]">
                    {/* Threshold overlay effect - blue overlay that fades out */}
                    <div
                      className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
                      style={{
                        backgroundColor: "var(--highlight)",
                        opacity: shouldAnimate ? 0.6 : 0,
                        transition: "opacity 0.4s ease-out",
                      }}
                    />
                    <div
                      className={`relative h-full w-full ${
                        shouldAnimate ? "animate-threshold" : ""
                      }`}
                    >
                      <ImageComponent
                        src={
                          media[selectedIndex].media?.fullSize?.mediaUrl || ""
                        }
                        alt={
                          media[selectedIndex].media?.fullSize?.mediaUrl ||
                          "Product thumbnail"
                        }
                        aspectRatio={calculateAspectRatio(
                          media[selectedIndex].media?.fullSize?.width,
                          media[selectedIndex].media?.fullSize?.height,
                        )}
                      />
                    </div>
                  </div>
                </TransformComponent>
              </TransformWrapper>
            )}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

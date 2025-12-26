"use client";

import { useEffect, useRef, useState } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { calculateAspectRatio, cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";
import { ImageZoom } from "@/components/ui/image-zoom";

const EMBLA_OPTIONS = {
  loop: true,
  dragFree: false,
  skipSnaps: true,
  align: "center" as const,
  axis: "x" as const,
  startIndex: 0,
};

export function MobileImageCarousel({ media }: { media: common_MediaFull[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTIONS, [
    WheelGesturesPlugin(),
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelectedIndex = () =>
      setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", updateSelectedIndex);
    updateSelectedIndex();
    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!isOpen || !emblaApi) {
      setShouldAnimate(false);
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setShouldAnimate(true);
    const timer = setTimeout(() => setShouldAnimate(false), 400);
    return () => clearTimeout(timer);
  }, [isOpen, emblaApi]);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const currentMedia = media[selectedIndex]?.media?.fullSize;

  const handleDoubleClick = () => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    setShouldAnimate(true);
    animationTimerRef.current = setTimeout(() => {
      setShouldAnimate(false);
      animationTimerRef.current = null;
    }, 400);
  };

  return (
    <DialogPrimitives.Root modal open={isOpen} onOpenChange={setIsOpen}>
      <div ref={emblaRef} className="relative overflow-hidden">
        <div className="flex h-full w-full">
          {media.map((m, index) => {
            const fullSize = m?.media?.fullSize;
            return (
              <div key={`${m.id}-${index}`} className="h-full flex-[0_0_102%]">
                <ImageComponent
                  src={fullSize?.mediaUrl!}
                  alt="Product image"
                  aspectRatio={calculateAspectRatio(
                    fullSize?.width,
                    fullSize?.height,
                  )}
                  fit="contain"
                />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 flex text-bgColor mix-blend-exclusion">
          <AnimatedButton
            animationDuration={300}
            animationArea="text-no-underline"
            onClick={() => emblaApi?.scrollPrev(true)}
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
            onClick={() => emblaApi?.scrollNext(true)}
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

          {currentMedia && (
            <ImageZoom onDoubleClick={handleDoubleClick}>
              <div className="relative h-full">
                <div
                  className={cn(
                    "duration-400 pointer-events-none absolute inset-0 z-10 bg-highlightColor opacity-0 mix-blend-screen transition-opacity ease-out",
                    { "opacity-60": shouldAnimate },
                  )}
                />
                <div
                  className={cn("relative h-full", {
                    "animate-threshold": shouldAnimate,
                  })}
                >
                  <ImageComponent
                    src={currentMedia.mediaUrl || ""}
                    alt={currentMedia.mediaUrl || "Product thumbnail"}
                    aspectRatio={calculateAspectRatio(
                      currentMedia.width,
                      currentMedia.height,
                    )}
                  />
                </div>
              </div>
            </ImageZoom>
          )}
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

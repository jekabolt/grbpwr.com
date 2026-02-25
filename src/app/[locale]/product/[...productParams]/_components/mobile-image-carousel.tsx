"use client";

import { useEffect, useRef, useState } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useTranslations } from "next-intl";

import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Overlay } from "@/components/ui/overlay";

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tAccessibility = useTranslations("accessibility");
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
    // Defer so overlay mounts with opacity-0, then transitions to opacity-60 (smooth fade-in)
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShouldAnimate(true);
        timerRef.current = setTimeout(() => {
          setShouldAnimate(false);
          timerRef.current = null;
        }, 400);
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, emblaApi]);

  const currentMedia = media[selectedIndex]?.media?.fullSize;

  return (
    <DialogPrimitives.Root modal open={isOpen} onOpenChange={setIsOpen}>
      <div ref={emblaRef} className="relative overflow-hidden">
        <div className="flex h-full w-full">
          {media.map((m, index) => {
            const compressed = m?.media?.compressed;
            // Prioritize first image for mobile LCP
            const isPriority = index === 0;
            return (
              <div key={`${m.id}-${index}`} className="h-full flex-[0_0_102%]">
                <ImageComponent
                  src={compressed?.mediaUrl!}
                  alt="Product image"
                  aspectRatio="4/5"
                  fit="contain"
                  priority={isPriority}
                  loading={isPriority ? "eager" : "lazy"}
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
          className="fixed inset-0 z-50 flex flex-col bg-bgColor"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>

          <DialogPrimitives.Close asChild>
            <Button className="fixed right-4 top-4 z-50">[x]</Button>
          </DialogPrimitives.Close>

          {currentMedia && (
            <div className="flex min-h-0 flex-1 flex-col pt-12">
              <ImageZoom>
                <div className="flex h-full w-full justify-center">
                  <div
                    className="relative h-full w-auto max-w-full"
                    style={{
                      aspectRatio: calculateAspectRatio(
                        currentMedia.width,
                        currentMedia.height,
                      ),
                    }}
                  >
                    <Overlay
                      cover="container"
                      color="highlight"
                      trigger="active"
                      active={shouldAnimate}
                    />
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
            </div>
          )}
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

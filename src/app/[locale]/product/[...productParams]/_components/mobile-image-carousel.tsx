"use client";

import { useCallback, useEffect, useState } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useTranslations } from "next-intl";

import {
  sendProductImageViewEvent,
  sendProductZoomEvent,
} from "@/lib/analitycs/product-engagement";
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

type MobileImageCarouselProps = {
  media: common_MediaFull[];
  productId?: string;
  productName?: string;
  productCategory?: string;
};

export function MobileImageCarousel({
  media,
  productId,
  productName,
  productCategory,
}: MobileImageCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tAccessibility = useTranslations("accessibility");
  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTIONS, [
    WheelGesturesPlugin(),
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelectedIndex = () => {
      const idx = emblaApi.selectedScrollSnap();
      setSelectedIndex(idx);
      if (productId) {
        sendProductImageViewEvent({
          product_id: productId,
          image_index: idx + 1,
          image_total: media.length,
          product_name: productName || "",
        });
      }
    };
    emblaApi.on("select", updateSelectedIndex);
    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi, productId, productName, media.length]);

  useEffect(() => {
    if (!isOpen || !emblaApi) {
      setShouldAnimate(false);
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setShouldAnimate(true);
  }, [isOpen, emblaApi]);

  const currentMedia = media[selectedIndex]?.media?.fullSize;

  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
  }, [isClosing]);

  const handleCloseComplete = useCallback(() => {
    setIsOpen(false);
    setIsClosing(false);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsOpen(true);
        setIsClosing(false);
      } else {
        requestClose();
      }
    },
    [requestClose],
  );

  const handleDoubleClick = () => {
    if (productId) {
      sendProductZoomEvent({
        product_id: productId,
        product_name: productName || "",
        product_category: productCategory || "",
      });
    }
    setShouldAnimate(false);
    requestAnimationFrame(() => setShouldAnimate(true));
  };

  return (
    <DialogPrimitives.Root modal open={isOpen} onOpenChange={handleOpenChange}>
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
        <div
          className="fixed inset-0 z-50 flex flex-col transition-all duration-200 ease-out data-[closing]:scale-95 data-[closing]:opacity-0"
          data-closing={isClosing || undefined}
          onTransitionEnd={(e) => {
            if (e.propertyName === "opacity" && isClosing)
              handleCloseComplete();
          }}
        >
          <DialogPrimitives.Overlay className="fixed inset-0 bg-black/50" />
          <DialogPrimitives.Content
            className="fixed inset-0 flex flex-col bg-bgColor"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogPrimitives.Title className="sr-only">
              {tAccessibility("mobile menu")}
            </DialogPrimitives.Title>

            <Button
              className="fixed right-4 top-4 z-50"
              onClick={requestClose}
              type="button"
            >
              [x]
            </Button>

            {currentMedia && (
              <div className="flex min-h-0 flex-1 flex-col pt-12">
                <ImageZoom
                  onDoubleClick={handleDoubleClick}
                  onClose={requestClose}
                >
                  <div className="relative h-full">
                    <div className="absolute inset-0">
                      <Overlay
                        cover="container"
                        color="highlight"
                        trigger="active"
                        active={shouldAnimate}
                        repeat
                        onAnimationComplete={() => setShouldAnimate(false)}
                      />
                    </div>
                    <ImageComponent
                      src={currentMedia.mediaUrl || ""}
                      alt={currentMedia.mediaUrl || "Product thumbnail"}
                      aspectRatio={calculateAspectRatio(
                        currentMedia.width,
                        currentMedia.height,
                      )}
                    />
                  </div>
                </ImageZoom>
              </div>
            )}
          </DialogPrimitives.Content>
        </div>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

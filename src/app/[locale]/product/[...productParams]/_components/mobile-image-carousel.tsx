"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { common_MediaFull } from "@/api/proto-http/frontend";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useTranslations } from "next-intl";

import {
  sendProductImageSwipeEvent,
  sendProductImageViewEvent,
  sendProductZoomEvent,
} from "@/lib/analitycs/product-engagement";
import { calculateAspectRatio } from "@/lib/utils";
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

export type CarouselNavApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
};

type MobileImageCarouselProps = {
  media: common_MediaFull[];
  productId?: string;
  productName?: string;
  productCategory?: string;
  scrollDisabled?: boolean;
  onCarouselApiReady?: (api: CarouselNavApi) => void;
};

export function MobileImageCarousel({
  media,
  productId,
  productName,
  productCategory,
  scrollDisabled = false,
  onCarouselApiReady,
}: MobileImageCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const highlightEndTimeoutRef = useRef<number | null>(null);
  const tAccessibility = useTranslations("accessibility");
  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTIONS, [
    WheelGesturesPlugin(),
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ ...EMBLA_OPTIONS, watchDrag: !scrollDisabled });
  }, [emblaApi, scrollDisabled]);

  useEffect(() => {
    if (!emblaApi) return;
    let prevIndex = emblaApi.selectedScrollSnap();

    const updateSelectedIndex = () => {
      const idx = emblaApi.selectedScrollSnap();

      if (idx !== prevIndex && productId) {
        const direction = idx > prevIndex ? "next" : "previous";
        sendProductImageSwipeEvent({
          product_id: productId,
          product_name: productName || "",
          product_category: productCategory || "",
          from_index: prevIndex + 1,
          to_index: idx + 1,
          total_images: media.length,
          swipe_direction: direction,
        });
      }

      prevIndex = idx;
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
  }, [emblaApi, productId, productName, productCategory, media.length]);

  useEffect(() => {
    if (!isOpen || !emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [isOpen, emblaApi]);

  // Only [isOpen] — emblaApi in deps was re-running this, resetting the flash and cancelling the timeout
  useEffect(() => {
    if (!isOpen) {
      setShouldAnimate(false);
      if (highlightEndTimeoutRef.current) {
        clearTimeout(highlightEndTimeoutRef.current);
        highlightEndTimeoutRef.current = null;
      }
      return;
    }
    setShouldAnimate(true);
    if (highlightEndTimeoutRef.current) {
      clearTimeout(highlightEndTimeoutRef.current);
    }
    highlightEndTimeoutRef.current = window.setTimeout(() => {
      setShouldAnimate(false);
      highlightEndTimeoutRef.current = null;
    }, 400);
    return () => {
      if (highlightEndTimeoutRef.current) {
        clearTimeout(highlightEndTimeoutRef.current);
        highlightEndTimeoutRef.current = null;
      }
    };
  }, [isOpen]);

  const scheduleHighlightEnd = useCallback(() => {
    if (highlightEndTimeoutRef.current) {
      clearTimeout(highlightEndTimeoutRef.current);
    }
    highlightEndTimeoutRef.current = window.setTimeout(() => {
      setShouldAnimate(false);
      highlightEndTimeoutRef.current = null;
    }, 400);
  }, []);

  useEffect(() => {
    if (emblaApi && onCarouselApiReady) {
      onCarouselApiReady({
        scrollPrev: () => emblaApi.scrollPrev(true),
        scrollNext: () => emblaApi.scrollNext(true),
      });
    }
  }, [emblaApi, onCarouselApiReady]);

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
        zoom_method: "double_click",
      });
    }
    setShouldAnimate(false);
    requestAnimationFrame(() => {
      setShouldAnimate(true);
      scheduleHighlightEnd();
    });
  };

  const handlePinchZoom = () => {
    if (productId) {
      sendProductZoomEvent({
        product_id: productId,
        product_name: productName || "",
        product_category: productCategory || "",
        zoom_method: "pinch",
      });
    }
  };

  return (
    <DialogPrimitives.Root modal open={isOpen} onOpenChange={handleOpenChange}>
      <div ref={emblaRef} className="relative overflow-hidden bg-bgColor">
        <div className="flex h-full w-full">
          {media.map((m, index) => {
            const compressed = m?.media?.compressed;
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
                  blurhash={media?.[selectedIndex]?.media?.blurhash}
                />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 flex text-bgColor mix-blend-exclusion">
          <DialogPrimitives.Trigger asChild>
            <div className="flex-1" />
          </DialogPrimitives.Trigger>
        </div>
      </div>

      <DialogPrimitives.Portal>
        <div
          className="fixed inset-0 z-[100] flex flex-col transition-all duration-200 ease-out data-[closing]:scale-95 data-[closing]:opacity-0"
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
              <div className="flex min-h-0 flex-1 flex-col">
                <ImageZoom
                  onDoubleClick={handleDoubleClick}
                  onClose={requestClose}
                  onPinchZoom={handlePinchZoom}
                >
                  <ImageComponent
                    src={currentMedia.mediaUrl || ""}
                    alt={currentMedia.mediaUrl || "Product thumbnail"}
                    aspectRatio={calculateAspectRatio(
                      currentMedia.width,
                      currentMedia.height,
                    )}
                    blurhash={media?.[selectedIndex]?.media?.blurhash}
                  />
                  <div className="absolute inset-0">
                    <Overlay
                      cover="container"
                      color="highlight"
                      trigger="active"
                      active={shouldAnimate}
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

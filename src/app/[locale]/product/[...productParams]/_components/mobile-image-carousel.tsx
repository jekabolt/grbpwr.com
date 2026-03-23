"use client";

import { useEffect, useState } from "react";
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
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    if (emblaApi && onCarouselApiReady) {
      onCarouselApiReady({
        scrollPrev: () => emblaApi.scrollPrev(true),
        scrollNext: () => emblaApi.scrollNext(true),
      });
    }
  }, [emblaApi, onCarouselApiReady]);

  const currentMedia = media[selectedIndex]?.media?.fullSize;

  const handleDoubleClick = () => {
    if (productId) {
      sendProductZoomEvent({
        product_id: productId,
        product_name: productName || "",
        product_category: productCategory || "",
        zoom_method: "double_click",
      });
    }
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
    <DialogPrimitives.Root modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitives.Trigger asChild>
        <div ref={emblaRef} className="relative overflow-hidden bg-bgColor">
          <div className="flex h-full w-full">
            {media.map((m, index) => {
              const compressed = m?.media?.compressed;
              const isPriority = index === 0;
              return (
                <div
                  key={`${m.id}-${index}`}
                  className="h-full flex-[0_0_102%]"
                >
                  <ImageComponent
                    src={compressed?.mediaUrl!}
                    alt="Product image"
                    aspectRatio="4/5"
                    fit="contain"
                    priority={isPriority}
                    loading={isPriority ? "eager" : "lazy"}
                    blurhash={m?.media?.blurhash}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-50 bg-overlay" />
        <DialogPrimitives.Content
          className="fixed inset-0 z-[100] flex flex-col bg-bgColor"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>

          <DialogPrimitives.Close asChild>
            <Button className="fixed right-4 top-4 z-50" type="button">
              [x]
            </Button>
          </DialogPrimitives.Close>

          {currentMedia && (
            <ImageZoom
              isOpen={isOpen}
              onDoubleClick={handleDoubleClick}
              onClose={() => setIsOpen(false)}
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
            </ImageZoom>
          )}
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

"use client";

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { common_MediaFull } from "@/api/proto-http/frontend";

import {
  sendProductImageSwipeEvent,
  sendProductImageViewEvent,
} from "@/lib/analitycs/product-engagement";
import { Carousel } from "@/components/ui/carousel";
import ImageComponent from "@/components/ui/image";

type Props = {
  className?: string;
  productMedia: common_MediaFull[];
  productId?: string;
  productName?: string;
};

export function ProductImagesCarousel({
  productMedia,
  productId,
  productName,
}: Props) {
  const tA = useTranslations("accessibility");
  const tImg = useTranslations("product");
  const oneMedia = productMedia.length === 1;
  // The carousel initially shows the slides at/after startIndex (not index 0,
  // which is off-screen). Priority must follow what's actually visible so the
  // LCP image isn't lazy-loaded.
  const startIndex = oneMedia ? 0 : 2;
  const prevIndexRef = useRef<number>(-1);

  const mediaForCarousel =
    productMedia.length <= 3 && productMedia.length > 1
      ? [...productMedia, ...productMedia]
      : productMedia;

  const handleSelectedIndex = useCallback(
    (index: number) => {
      if (index === prevIndexRef.current) return;

      const prevIndex = prevIndexRef.current;
      prevIndexRef.current = index;
      const realIndex = index % productMedia.length;

      if (productId) {
        if (prevIndex !== -1) {
          const prevRealIndex = prevIndex % productMedia.length;
          const direction = realIndex > prevRealIndex ? "next" : "previous";
          sendProductImageSwipeEvent({
            product_id: productId,
            product_name: productName || "",
            product_category: "",
            from_index: prevRealIndex + 1,
            to_index: realIndex + 1,
            total_images: productMedia.length,
            swipe_direction: direction,
          });
        }

        sendProductImageViewEvent({
          product_id: productId,
          image_index: realIndex + 1,
          image_total: productMedia.length,
          product_name: productName || "",
        });
      }
    },
    [productId, productName, productMedia.length],
  );

  return (
    <div className="relative h-full">
      <Carousel
        loop={productMedia.length > 1}
        align={oneMedia ? "start" : "end"}
        startIndex={startIndex}
        className="flex h-screen w-full pt-14"
        scrollOnClick={true}
        prevLabel={tA("previous image")}
        nextLabel={tA("next image")}
        setSelectedIndex={handleSelectedIndex}
      >
        {mediaForCarousel.map((m, index) => {
          const isPriority = index >= startIndex && index < startIndex + 2;
          return (
            <div
              key={`${m.id}-${index}`}
              className="h-full w-full flex-[0_0_48%]"
            >
              <ImageComponent
                src={m?.media?.compressed?.mediaUrl!}
                alt={
                  productName
                    ? tImg("image alt", {
                        name: productName,
                        index: (index % productMedia.length) + 1,
                        total: productMedia.length,
                      })
                    : tImg("image alt unnamed", {
                        index: (index % productMedia.length) + 1,
                        total: productMedia.length,
                      })
                }
                aspectRatio="4/5"
                fit="contain"
                priority={isPriority}
                loading={isPriority ? "eager" : "lazy"}
                blurhash={m?.media?.blurhash}
              />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

"use client";

import { useCallback, useRef } from "react";
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
  const oneMedia = productMedia.length === 1;
  const prevIndexRef = useRef<number>(-1);

  const mediaForCarousel =
    productMedia.length <= 3 && productMedia.length > 1
      ? [...productMedia, ...productMedia]
      : productMedia;

  const handleSelectedIndex = useCallback(
    (index: number) => {
      if (index === prevIndexRef.current) return;
      prevIndexRef.current = index;
      const realIndex = index % productMedia.length;

      if (productId) {
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

  const swipePrevIndexRef = useRef<number>(-1);

  const handleSettledIndex = useCallback(
    (index: number) => {
      const realIndex = index % productMedia.length;
      const prevReal = swipePrevIndexRef.current;
      swipePrevIndexRef.current = realIndex;

      if (productId && prevReal !== -1 && prevReal !== realIndex) {
        sendProductImageSwipeEvent({
          product_id: productId,
          product_name: productName || "",
          product_category: "",
          from_index: prevReal + 1,
          to_index: realIndex + 1,
          total_images: productMedia.length,
          swipe_direction: realIndex > prevReal ? "next" : "previous",
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
        startIndex={oneMedia ? 0 : 2}
        className="flex h-screen w-full pt-14"
        scrollOnClick={true}
        dragFree={false}
        setSelectedIndex={handleSelectedIndex}
        onSettle={handleSettledIndex}
      >
        {mediaForCarousel.map((m, index) => {
          const isPriority = index < 2;
          return (
            <div
              key={`${m.id}-${index}`}
              className="h-full w-full flex-[0_0_48%]"
            >
              <ImageComponent
                src={m?.media?.compressed?.mediaUrl!}
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
      </Carousel>
    </div>
  );
}

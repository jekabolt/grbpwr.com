"use client";

import { Children, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { createTouchHandlers, createWheelHandler } from "@/lib/carousel-utils";
import { cn } from "@/lib/utils";

export interface CarouselRef {
  scrollNext: () => void;
  scrollPrev: () => void;
  emblaApi?: any;
  isDisabled?: boolean;
}

type CarouselProps = {
  className?: string;
  children: React.ReactNode;
  loop?: boolean;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  disableForItemCounts?: number[];
  axis?: "x" | "y";
  enablePageScroll?: boolean;
  startIndex?: number;
  dragFree?: boolean;
  skipSnaps?: boolean;
  scrollOnClick?: boolean;
  setSelectedIndex?: (index: number) => void;
};

export function Carousel({
  className,
  children,
  loop = false,
  disabled = false,
  align = "start",
  axis = "x",
  disableForItemCounts,
  enablePageScroll = false,
  startIndex = 0,
  dragFree = true,
  skipSnaps = true,
  scrollOnClick = false,
  setSelectedIndex,
}: CarouselProps) {
  const childrenCount = Children.count(children);
  const isDisabled = disabled || disableForItemCounts?.includes(childrenCount);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      dragFree,
      skipSnaps,
      align,
      axis,
      startIndex,
    },
    isDisabled ? [] : [WheelGesturesPlugin()],
  );

  function onSelect() {
    if (!emblaApi || !setSelectedIndex || isDisabled) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
  }

  useEffect(() => {
    if (!emblaApi || !enablePageScroll || isDisabled) return;

    const viewport = emblaApi.rootNode();

    const onWheel = createWheelHandler(emblaApi, {
      enablePageScroll,
      loop,
    });

    const { onTouchStart, onTouchMove } = createTouchHandlers(emblaApi, {
      loop,
      bridgeToPageAtEdges: true,
    });

    viewport.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });
    viewport.addEventListener("touchstart", onTouchStart, {
      passive: true,
      capture: true,
    });
    viewport.addEventListener("touchmove", onTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      viewport.removeEventListener("touchstart", onTouchStart, {
        capture: true,
      });
      viewport.removeEventListener("touchmove", onTouchMove, {
        capture: true,
      });
    };
  }, [emblaApi, enablePageScroll, loop, isDisabled]);

  useEffect(() => {
    if (!emblaApi || isDisabled) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, isDisabled]);

  function scrollNext() {
    emblaApi?.scrollNext();
  }

  function scrollPrev() {
    emblaApi?.scrollPrev();
  }

  return (
    <div
      ref={emblaRef}
      className={cn("relative overflow-hidden", {
        relative: scrollOnClick,
      })}
    >
      <div className={className}>{children}</div>
      {scrollOnClick && (
        <div className="absolute inset-0 flex h-full">
          <div onClick={scrollPrev} className="h-full flex-1" />
          <div onClick={scrollNext} className="h-full flex-1" />
        </div>
      )}
    </div>
  );
}

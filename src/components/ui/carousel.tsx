"use client";

import { Children, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { createScrollHandler } from "@/lib/carousel-utils";

type CarouselProps = {
  className?: string;
  children: React.ReactNode;
  loop?: boolean;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  disableForItemCounts?: number[];
  axis?: "x" | "y";
  enablePageScroll?: boolean;
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
  setSelectedIndex,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bridgeTimeout = useRef<NodeJS.Timeout | null>(null);
  const touchStart = useRef(0);
  const childrenCount = Children.count(children);
  const isDisabled = disabled || disableForItemCounts?.includes(childrenCount);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    isDisabled ? undefined : { loop, dragFree: true, align, axis },
    isDisabled ? [] : [WheelGesturesPlugin()],
  );

  const handleScroll = createScrollHandler(
    emblaApi,
    containerRef,
    bridgeTimeout,
  );

  const handleWheel = (e: WheelEvent) => handleScroll(e, e.deltaY);

  const handleTouchMove = (e: TouchEvent) => {
    const deltaY = (e.touches[0]?.clientY ?? 0) - touchStart.current;

    // Only intercept touch if we're at carousel boundaries and trying to scroll beyond
    if (emblaApi) {
      const isAtStart = !emblaApi.canScrollPrev();
      const isAtEnd = !emblaApi.canScrollNext();
      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;

      // Only intercept if we're at a boundary and trying to scroll beyond
      if ((scrollingDown && isAtEnd) || (scrollingUp && isAtStart)) {
        if (Math.abs(deltaY) > 10) {
          e.preventDefault();
          handleScroll(e, deltaY);
        }
      }
    }
  };
  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.touches[0]?.clientY ?? 0;
  };

  const onSelect = () => {
    if (!emblaApi || !setSelectedIndex) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!enablePageScroll || !containerRef.current) return;

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart as any);
      container.removeEventListener("touchmove", handleTouchMove as any);
    };
  }, [enablePageScroll, emblaApi]);

  const combinedRef = (node: HTMLDivElement | null) => {
    if (!disabled && emblaRef) emblaRef(node);
    containerRef.current = node;
  };

  return (
    <div ref={combinedRef} className="overflow-hidden">
      <div className={className}>{children}</div>
    </div>
  );
}

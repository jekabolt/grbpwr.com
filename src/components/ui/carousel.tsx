"use client";

import { Children, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { scrollPage } from "@/lib/carousel-utils";

type CarouselProps = {
  className?: string;
  children: React.ReactNode;
  loop?: boolean;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  disableForItemCounts?: number[];
  axis?: "x" | "y";
  enablePageScroll?: boolean;
  selectedIndex?: number;
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
  setSelectedIndex,
  enablePageScroll = true,
}: CarouselProps) {
  const childrenCount = Children.count(children);
  const isDisabled = disabled || disableForItemCounts?.includes(childrenCount);
  const isVertical = axis === "y";

  const wheelListenerRef = useRef<((e: WheelEvent) => void) | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    isDisabled
      ? undefined
      : {
          loop,
          dragFree: true,
          align,
          axis,
          skipSnaps: true,
        },
    isDisabled ? [] : [WheelGesturesPlugin()],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !setSelectedIndex) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
  }, [emblaApi, setSelectedIndex]);

  const checkCarouselBounds = () => {
    if (!emblaApi) return { isAtEnd: false, isAtStart: false };

    const canScrollNext = emblaApi.canScrollNext();
    const canScrollPrev = emblaApi.canScrollPrev();
    const scrollProgress = emblaApi.scrollProgress();

    const isAtEnd = !canScrollNext && scrollProgress >= 0.99;
    const isAtStart = !canScrollPrev && scrollProgress <= 0.01;

    return { isAtEnd, isAtStart };
  };

  useEffect(() => {
    if (!emblaApi || !isVertical || !enablePageScroll) return;

    const viewport = emblaApi.rootNode();

    const onWheel = (e: WheelEvent) => {
      if (!emblaApi) return;
      const { isAtEnd, isAtStart } = checkCarouselBounds();

      if (e.deltaY > 0 && isAtEnd && !loop) {
        e.stopPropagation();
        return;
      }
      if (e.deltaY < 0 && isAtStart && !loop) {
        e.stopPropagation();
        return;
      }
      e.preventDefault();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!emblaApi) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;

      const canScrollNext = emblaApi.canScrollNext();
      const canScrollPrev = emblaApi.canScrollPrev();

      const swipeUp = deltaY > 0;
      const swipeDown = deltaY < 0;

      if (swipeUp && !canScrollNext && !loop) {
        e.preventDefault();
        scrollPage("down");
        return;
      }
      if (swipeDown && !canScrollPrev && !loop) {
        e.preventDefault();
        scrollPage("up");
        return;
      }
      if ((swipeUp && canScrollNext) || (swipeDown && canScrollPrev)) {
        e.preventDefault();
        return;
      }
    };

    if (wheelListenerRef.current) {
      viewport.removeEventListener("wheel", wheelListenerRef.current);
    }
    wheelListenerRef.current = onWheel;

    // attach
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
      if (wheelListenerRef.current) {
        viewport.removeEventListener("wheel", wheelListenerRef.current, {
          capture: true,
        });
      }
      viewport.removeEventListener("touchstart", onTouchStart, {
        capture: true,
      });
      viewport.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, [emblaApi, isVertical, enablePageScroll, loop, checkCarouselBounds]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div ref={emblaRef} className="h-screen overflow-hidden">
      <div className={className}>{children}</div>
    </div>
  );
}

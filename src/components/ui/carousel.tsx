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
    isDisabled
      ? undefined
      : {
          loop,
          dragFree: true,
          align,
          axis,
        },
    isDisabled ? [] : [WheelGesturesPlugin()],
  );

  const handleScroll = createScrollHandler(
    emblaApi,
    containerRef,
    bridgeTimeout,
  );

  const handleWheel = (e: WheelEvent) => handleScroll(e, e.deltaY);

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0]?.clientY ?? 0;
    const deltaY = currentY - touchStart.current;

    // Forward all touch moves to the scroll handler; it will decide when to intercept
    handleScroll(e, deltaY);
  };
  const handleTouchStart = (e: TouchEvent) => {
    console.log("Touch start detected");
    touchStart.current = e.touches[0]?.clientY ?? 0;
  };

  const onSelect = () => {
    if (!emblaApi || !setSelectedIndex) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);

    // Check if we're at boundaries
    const isAtStart = !emblaApi.canScrollPrev();
    const isAtEnd = !emblaApi.canScrollNext();

    console.log("Carousel selected:", {
      currentIndex,
      isAtStart,
      isAtEnd,
      totalSlides: emblaApi.slideNodes().length,
    });

    // If at boundary, log that page scroll should be enabled
    if (isAtStart || isAtEnd) {
      console.log("At boundary - page scroll should be enabled");
    }
  };

  const onDragEnd = () => {
    if (!emblaApi) return;

    // Check if we're at boundaries after drag ends
    const isAtStart = !emblaApi.canScrollPrev();
    const isAtEnd = !emblaApi.canScrollNext();

    console.log("Drag ended:", { isAtStart, isAtEnd });

    // If at boundary, allow page scroll
    if (isAtStart || isAtEnd) {
      console.log("At boundary, page scroll enabled");
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("settle", onDragEnd);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("settle", onDragEnd);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!enablePageScroll || !containerRef.current) return;

    console.log("Setting up touch event listeners");

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

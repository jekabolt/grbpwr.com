"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
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
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Определяем тип устройства
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    isDisabled
      ? undefined
      : {
          loop,
          dragFree: false,
          align,
          axis,
          skipSnaps: false,
        },
    isDisabled
      ? []
      : [
          WheelGesturesPlugin(
            isVertical
              ? {
                  forceWheelAxis: "y",
                }
              : {},
          ),
        ],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !setSelectedIndex) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
  }, [emblaApi, setSelectedIndex]);

  // Проверка границ карусели
  const checkCarouselBounds = useCallback(() => {
    if (!emblaApi) return { isAtEnd: false, isAtStart: false };

    const canScrollNext = emblaApi.canScrollNext();
    const canScrollPrev = emblaApi.canScrollPrev();
    const scrollProgress = emblaApi.scrollProgress();

    const isAtEnd = !canScrollNext && scrollProgress >= 0.99;
    const isAtStart = !canScrollPrev && scrollProgress <= 0.01;

    return { isAtEnd, isAtStart };
  }, [emblaApi]);

  // Управление wheel событиями для десктопа
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!emblaApi || !isVertical || !enablePageScroll || isTouchDevice)
        return;

      const { isAtEnd, isAtStart } = checkCarouselBounds();

      // Прокрутка вниз на последнем элементе
      if (e.deltaY > 0 && isAtEnd && !loop) {
        e.stopPropagation();
        return;
      }

      // Прокрутка вверх на первом элементе
      if (e.deltaY < 0 && isAtStart && !loop) {
        e.stopPropagation();
        return;
      }

      e.preventDefault();
    },
    [
      emblaApi,
      isVertical,
      enablePageScroll,
      loop,
      isTouchDevice,
      checkCarouselBounds,
    ],
  );

  // Установка обработчиков wheel событий для десктопа
  useEffect(() => {
    if (!emblaApi || !isVertical || !enablePageScroll || isTouchDevice) return;

    const viewport = emblaApi.rootNode();

    if (wheelListenerRef.current) {
      viewport.removeEventListener("wheel", wheelListenerRef.current);
    }

    wheelListenerRef.current = handleWheel;
    viewport.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      if (wheelListenerRef.current) {
        viewport.removeEventListener("wheel", wheelListenerRef.current, {
          capture: true,
        });
      }
    };
  }, [handleWheel, emblaApi, isVertical, enablePageScroll, isTouchDevice]);

  // Установка обработчиков touch событий для мобильных устройств
  // Установка обработчиков touch событий для мобильных устройств
  useEffect(() => {
    if (!emblaApi || !isVertical || !enablePageScroll || !isTouchDevice) return;

    const viewport = emblaApi.rootNode();
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY; // >0: свайп вверх (страница вниз)

      const canScrollNext = emblaApi.canScrollNext();
      const canScrollPrev = emblaApi.canScrollPrev();

      const swipeUp = deltaY > 0;
      const swipeDown = deltaY < 0;

      // Если на границе — передаём скролл странице вручную
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

      // Блокируем страницу только если карусель может скроллиться в направлении жеста
      if ((swipeUp && canScrollNext) || (swipeDown && canScrollPrev)) {
        e.preventDefault();
        return;
      }
      // Иначе не мешаем — пусть страница скроллится
    };

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
      viewport.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, [emblaApi, isVertical, enablePageScroll, isTouchDevice, loop]);

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

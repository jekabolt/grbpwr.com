"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

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
  const touchStartRef = useRef<{ y: number; x: number; time: number } | null>(
    null,
  );
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
          containScroll: "keepSnaps",
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

  // Обработка touch событий для мобильных устройств
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!emblaApi || !isVertical || !enablePageScroll || !isTouchDevice)
        return;

      const touch = e.touches[0];
      touchStartRef.current = {
        y: touch.clientY,
        x: touch.clientX,
        time: Date.now(),
      };
    },
    [emblaApi, isVertical, enablePageScroll, isTouchDevice],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (
        !emblaApi ||
        !isVertical ||
        !enablePageScroll ||
        !isTouchDevice ||
        !touchStartRef.current
      )
        return;

      const touch = e.touches[0];
      const deltaY = touchStartRef.current.y - touch.clientY;
      const { isAtEnd, isAtStart } = checkCarouselBounds();

      // Проверяем направление свайпа и позицию карусели
      const isSwipeDown = deltaY < 0; // Свайп вниз (прокрутка вверх контента)
      const isSwipeUp = deltaY > 0; // Свайп вверх (прокрутка вниз контента)

      // Если свайпаем вверх на последнем элементе - разрешаем прокрутку страницы
      if (isSwipeUp && isAtEnd && !loop) {
        return; // Не блокируем событие
      }

      // Если свайпаем вниз на первом элементе - разрешаем прокрутку страницы
      if (isSwipeDown && isAtStart && !loop) {
        return; // Не блокируем событие
      }

      // В остальных случаях блокируем прокрутку страницы
      e.preventDefault();
    },
    [
      emblaApi,
      isVertical,
      enablePageScroll,
      isTouchDevice,
      loop,
      checkCarouselBounds,
    ],
  );

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

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
  useEffect(() => {
    if (!emblaApi || !isVertical || !enablePageScroll || !isTouchDevice) return;

    const viewport = emblaApi.rootNode();
    let touchStartY = 0;
    let allowPageScroll = false;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;

      // Проверяем границы сразу при начале касания
      const canScrollNext = emblaApi.canScrollNext();
      const canScrollPrev = emblaApi.canScrollPrev();
      const scrollProgress = emblaApi.scrollProgress();

      const isAtEnd = !canScrollNext && scrollProgress >= 0.95;
      const isAtStart = !canScrollPrev && scrollProgress <= 0.05;

      allowPageScroll = (isAtEnd || isAtStart) && !loop;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (allowPageScroll) {
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;

        const canScrollNext = emblaApi.canScrollNext();
        const canScrollPrev = emblaApi.canScrollPrev();

        // Разрешаем прокрутку страницы в направлении, куда нельзя прокрутить карусель
        if ((deltaY > 0 && !canScrollNext) || (deltaY < 0 && !canScrollPrev)) {
          return; // Не блокируем - разрешаем прокрутку страницы
        }
      }

      // Блокируем прокрутку страницы
      e.preventDefault();
    };

    // Используем capture для перехвата событий до Embla
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
    <div
      ref={emblaRef}
      className={`h-screen overflow-hidden ${isVertical ? "touch-pan-x" : "touch-pan-y"}`}
      style={{
        // Дополнительные стили для мобильных устройств
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: isVertical ? "contain" : "auto",
      }}
    >
      <div
        className={className}
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          height: isVertical ? "100%" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

"use client";

import { Children, useCallback, useEffect, useRef } from "react";
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

  // Управление прокруткой страницы с точной проверкой границ
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!emblaApi || !isVertical || !enablePageScroll) return;

      const canScrollNext = emblaApi.canScrollNext();
      const canScrollPrev = emblaApi.canScrollPrev();
      const scrollProgress = emblaApi.scrollProgress();

      // Более точная проверка: проверяем не только возможность прокрутки,
      // но и текущую позицию
      const isAtEnd = !canScrollNext && scrollProgress >= 0.99;
      const isAtStart = !canScrollPrev && scrollProgress <= 0.01;

      // Прокрутка вниз на последнем элементе
      if (e.deltaY > 0 && isAtEnd && !loop) {
        // Полностью отключаем обработку события каруселью
        e.stopPropagation();
        return; // Позволяем браузеру обработать прокрутку
      }

      // Прокрутка вверх на первом элементе
      if (e.deltaY < 0 && isAtStart && !loop) {
        e.stopPropagation();
        return;
      }

      // Блокируем прокрутку страницы только если карусель может прокручиваться
      e.preventDefault();
    },
    [emblaApi, isVertical, enablePageScroll, loop],
  );

  useEffect(() => {
    if (!emblaApi || !isVertical || !enablePageScroll) return;

    const viewport = emblaApi.rootNode();

    // Удаляем предыдущий обработчик если он есть
    if (wheelListenerRef.current) {
      viewport.removeEventListener("wheel", wheelListenerRef.current);
    }

    // Добавляем новый обработчик с capture: true для перехвата события до карусели
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
  }, [handleWheel, emblaApi, isVertical, enablePageScroll]);

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

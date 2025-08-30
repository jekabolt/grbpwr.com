"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import { Arrow } from "./icons/arrow";

export interface BottomSheetProps {
  children: ReactNode;
  mainAreaRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isCarouselScrolling?: boolean;
}

export function BottomSheet({
  children,
  mainAreaRef,
  containerRef,
  isCarouselScrolling = false,
}: BottomSheetProps) {
  const [containerHeight, setContainerHeight] = useState(150);
  const [hideArrows, setHideArrows] = useState(false);

  const config = {
    movementThreshold: 5,
    sensitivity: 3,
    minHeight: 150,
    topOffset: 48,
  };

  const touchState = useRef({
    startY: 0,
    startX: 0,
    lastY: 0,
    isDragging: false,
    hasMoved: false,
    isVertical: false,
    startedAtTop: false,
  });

  // Функция определения, можно ли прокручивать внутренний контент
  const canScrollInside = () => {
    if (typeof window === "undefined") return false;

    const maxHeight = window.innerHeight - config.topOffset;

    return containerHeight >= maxHeight;
  };

  // Обновляем состояние стрелок при изменении высоты контейнера
  useEffect(() => {
    if (typeof window === "undefined") return;

    const maxHeight = window.innerHeight - config.topOffset;
    const isAtMaxHeight = containerHeight >= maxHeight;
    const isDragging = touchState.current.isDragging;

    setHideArrows(isAtMaxHeight || isDragging || isCarouselScrolling);
  }, [containerHeight, config.topOffset, isCarouselScrolling]);

  useEffect(() => {
    const mainArea = mainAreaRef.current;
    if (!mainArea) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const state = touchState.current;

      state.startY = touch.clientY;
      state.startX = touch.clientX;
      state.lastY = touch.clientY;
      state.isDragging = false;
      state.hasMoved = false;
      state.isVertical = false;

      // Проверяем, началось ли касание в верхней части контента
      if (containerRef.current && canScrollInside()) {
        const scrollableElement = containerRef.current.querySelector(
          '[class*="overflow-y-scroll"]',
        );
        if (scrollableElement) {
          state.startedAtTop = scrollableElement.scrollTop <= 5; // 5px tolerance
        }
      } else {
        state.startedAtTop = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const state = touchState.current;
      const currentY = touch.clientY;
      const currentX = touch.clientX;

      const deltaY = Math.abs(currentY - state.startY);
      const deltaX = Math.abs(currentX - state.startX);
      const totalMovement = Math.max(deltaY, deltaX);

      if (totalMovement > config.movementThreshold && !state.hasMoved) {
        state.hasMoved = true;
        state.isVertical = deltaY > deltaX;

        if (state.isVertical) {
          // Включаем драг только если НЕ можем прокручивать внутри
          if (!canScrollInside()) {
            state.isDragging = true;
            e.preventDefault();
          } else {
            // Если лист расширен и пользователь делает свайп вниз с верха контента, включаем драг для закрытия
            const isSwipeDown = currentY > state.startY;
            if (isSwipeDown && state.startedAtTop) {
              state.isDragging = true;
              e.preventDefault();
            }
          }

          // Обновляем состояние стрелок при начале драга
          if (state.isDragging) {
            const maxHeight = window.innerHeight - config.topOffset;
            const isAtMaxHeight = containerHeight >= maxHeight;
            setHideArrows(isAtMaxHeight || true || isCarouselScrolling); // Hide arrows when dragging
          }

          // Если можем прокручивать внутри, НЕ включаем драг - позволяем естественную прокрутку
        }
      }

      if (state.hasMoved && state.isDragging && state.isVertical) {
        // Если можем прокручивать внутри, не блокируем событие
        // Но всегда блокируем если пользователь пытается закрыть расширенный лист
        const isCollapsingFromExpanded =
          canScrollInside() && currentY > state.startY && state.startedAtTop;
        if (!canScrollInside() || isCollapsingFromExpanded) {
          e.preventDefault();
        }

        const deltaMove = state.lastY - currentY;
        const maxHeight = window.innerHeight - config.topOffset;
        let newHeight = containerHeight + deltaMove * config.sensitivity;

        if (newHeight < config.minHeight) {
          const overshoot = config.minHeight - newHeight;
          newHeight = config.minHeight - Math.pow(overshoot, 0.7) * 0.3;
        } else if (newHeight > maxHeight) {
          const overshoot = newHeight - maxHeight;
          newHeight = maxHeight + Math.pow(overshoot, 0.7) * 0.3;
        }

        setContainerHeight(newHeight);
        state.lastY = currentY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const state = touchState.current;

      if (!state.hasMoved) return;

      if (state.isDragging && state.isVertical) {
        // Предотвращаем событие только если НЕ можем прокручивать внутри
        // Или если пользователь пытался закрыть расширенный лист
        const wasCollapsingFromExpanded =
          canScrollInside() && state.lastY > state.startY && state.startedAtTop;
        if (!canScrollInside() || wasCollapsingFromExpanded) {
          e.preventDefault();
        }

        const maxHeight = window.innerHeight - config.topOffset;

        if (containerHeight < config.minHeight) {
          setContainerHeight(config.minHeight);
        } else if (containerHeight > maxHeight) {
          setContainerHeight(maxHeight);
        }
      }

      state.hasMoved = false;
      state.isVertical = false;
      state.isDragging = false;

      // Обновляем состояние стрелок при окончании драга
      const maxHeight = window.innerHeight - config.topOffset;
      const isAtMaxHeight = containerHeight >= maxHeight;
      setHideArrows(isAtMaxHeight || isCarouselScrolling); // Show arrows again if not at max height and not scrolling carousel
    };

    mainArea.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    mainArea.addEventListener("touchmove", handleTouchMove, { passive: false });
    mainArea.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      mainArea.removeEventListener("touchstart", handleTouchStart);
      mainArea.removeEventListener("touchmove", handleTouchMove);
      mainArea.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerHeight]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-x-2.5 bottom-0 z-30 flex flex-col bg-bgColor"
      style={{
        height: containerHeight,
        overflowY: canScrollInside() ? "auto" : "hidden",
      }}
      animate={{ height: containerHeight }}
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 55,
        mass: 0.5,
        velocity: 100,
      }}
    >
      {/* {!hideArrows && (
        
      )} */}

      <div className="w-full bg-transparent">
        <div className="flex h-6 w-full flex-shrink-0 items-center justify-between">
          <Arrow className="-rotate-90" />
          <Arrow className="rotate-90" />
        </div>
      </div>

      {children}
    </motion.div>
  );
}

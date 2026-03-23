"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { createPortal } from "react-dom";

import {
  useBottomSheet,
  type UseBottomSheetConfig,
} from "../../lib/hooks/useBottomSheet";
import { AnimatedButton } from "./animated-button";

export type CarouselNavProps = {
  onPrev: () => void;
  onNext: () => void;
};

export interface BottomSheetProps {
  children: ReactNode;
  mainAreaRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isCarouselScrolling?: boolean;
  config?: UseBottomSheetConfig;
  contentAboveRef?: React.RefObject<HTMLDivElement>;
  collapseRef?: React.RefObject<(() => void) | null>;
  scrollDisabled?: boolean;
  carouselNav?: CarouselNavProps & { overlayHeight: number };
}

export function BottomSheet({
  children,
  mainAreaRef,
  containerRef,
  isCarouselScrolling = false,
  config,
  contentAboveRef,
  collapseRef,
  scrollDisabled = false,
  carouselNav,
}: BottomSheetProps) {
  const [carouselNavPortalReady, setCarouselNavPortalReady] = useState(false);

  useLayoutEffect(() => {
    setCarouselNavPortalReady(true);
  }, []);

  const initialHeight = config?.initialState ?? config?.minHeight ?? 150;
  const heightMotionValue = useMotionValue(initialHeight);

  const heightSpring = useSpring(heightMotionValue, {
    stiffness: 800,
    damping: 60,
    mass: 0.1,
    restDelta: 0.5,
    restSpeed: 2,
  });

  const { containerHeight, canScrollInside, touchState, collapseToMin } =
    useBottomSheet({
      mainAreaRef,
      containerRef,
      isCarouselScrolling,
      config,
      contentAboveRef,
      heightMotionValue,
      scrollDisabled,
    });

  useEffect(() => {
    if (!touchState.isDragging) {
      heightMotionValue.set(containerHeight);
    }
  }, [containerHeight, touchState.isDragging, heightMotionValue]);

  useEffect(() => {
    if (collapseRef) {
      collapseRef.current = collapseToMin;
      return () => {
        collapseRef.current = null;
      };
    }
  }, [collapseRef, collapseToMin]);

  const carouselNavPortal =
    carouselNav &&
    !canScrollInside &&
    carouselNavPortalReady &&
    createPortal(
      <motion.div
        className="pointer-events-none fixed z-30 flex w-full items-end justify-between text-bgColor mix-blend-difference"
        style={{
          bottom: heightSpring,
          height: carouselNav.overlayHeight,
        }}
        data-bottom-sheet-ignore-drag="true"
      >
        <AnimatedButton
          animationDuration={300}
          animationArea="text-no-underline"
          onClick={carouselNav.onPrev}
          className="pointer-events-auto flex w-20 flex-col items-start justify-end pl-2.5"
        >
          {"<"}
        </AnimatedButton>
        <AnimatedButton
          animationArea="text-no-underline"
          animationDuration={300}
          onClick={carouselNav.onNext}
          className="pointer-events-auto z-50 flex w-20 flex-col items-end justify-end pr-2.5"
        >
          {">"}
        </AnimatedButton>
      </motion.div>,
      document.body,
    );

  return (
    <div className="pointer-events-none absolute inset-0 scroll-smooth">
      {carouselNavPortal}
      <motion.div
        ref={containerRef}
        className="absolute inset-x-2.5 bottom-0 z-30 flex flex-col overflow-visible"
        style={{
          height: heightSpring,
        }}
      >
        <div
          className={`border-b-none pointer-events-auto h-full space-y-6 overflow-hidden border-x border-t border-textInactiveColor bg-bgColor px-2.5 pb-32 pt-2.5 mix-blend-normal ${
            scrollDisabled || !canScrollInside
              ? "touch-none overflow-hidden"
              : "overflow-y-auto overscroll-y-contain"
          }`}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

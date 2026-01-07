"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import {
  useBottomSheet,
  type UseBottomSheetConfig,
} from "../../lib/hooks/useBottomSheet";

export interface BottomSheetProps {
  children: ReactNode;
  mainAreaRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isCarouselScrolling?: boolean;
  config?: UseBottomSheetConfig;
  contentAboveRef?: React.RefObject<HTMLDivElement>;
}

export function BottomSheet({
  children,
  mainAreaRef,
  containerRef,
  isCarouselScrolling = false,
  config,
  contentAboveRef,
}: BottomSheetProps) {
  const heightMotionValue = useMotionValue(config?.minHeight ?? 150);

  const heightSpring = useSpring(heightMotionValue, {
    stiffness: 600,
    damping: 60,
    mass: 1.2,
    restDelta: 0.5,
    restSpeed: 2,
  });

  const { containerHeight, canScrollInside, touchState } = useBottomSheet({
    mainAreaRef,
    containerRef,
    isCarouselScrolling,
    config,
    contentAboveRef,
    heightMotionValue,
  });

  useEffect(() => {
    if (!touchState.isDragging) {
      heightMotionValue.set(containerHeight);
    }
  }, [containerHeight, touchState.isDragging, heightMotionValue]);

  return (
    <div className="pointer-events-none absolute inset-0 scroll-smooth">
      <motion.div
        ref={containerRef}
        className="absolute inset-x-2.5 bottom-0 z-30 flex flex-col overflow-hidden"
        style={{
          height: heightSpring,
        }}
      >
        <div
          className={`border-b-none pointer-events-auto h-full space-y-6 border-x border-t border-textInactiveColor bg-bgColor px-2.5 pb-32 pt-2.5 ${
            canScrollInside
              ? "overflow-y-auto overscroll-contain"
              : "touch-none overflow-hidden"
          }`}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

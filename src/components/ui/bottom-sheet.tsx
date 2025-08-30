"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

import {
  useBottomSheet,
  type UseBottomSheetConfig,
} from "../../lib/hooks/useBottomSheet";
import { AnimatedButton } from "./animated-button";

export interface BottomSheetProps {
  children: ReactNode;
  mainAreaRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isCarouselScrolling?: boolean;
  onArrowLeftClick?: () => void;
  onArrowRightClick?: () => void;
  config?: UseBottomSheetConfig;
}

export function BottomSheet({
  children,
  mainAreaRef,
  containerRef,
  isCarouselScrolling = false,
  config,
  onArrowLeftClick,
  onArrowRightClick,
}: BottomSheetProps) {
  const { containerHeight, hideArrows, canScrollInside } = useBottomSheet({
    mainAreaRef,
    containerRef,
    isCarouselScrolling,
    config,
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        ref={containerRef}
        className="absolute inset-x-2.5 bottom-0 z-30 flex flex-col"
        style={{
          height: containerHeight,
          overflowY: canScrollInside ? "auto" : "hidden",
        }}
        animate={{ height: containerHeight }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 100,
          mass: 0.1,
          velocity: 50,
        }}
      >
        {!hideArrows && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
            }}
            className="w-full"
          >
            <div className="pointer-events-auto flex h-10 w-full flex-shrink-0 items-center justify-between">
              <AnimatedButton
                className="h-full w-1/2 text-left"
                animationDuration={500}
                onClick={() => {
                  onArrowLeftClick?.();
                }}
              >
                {"<"}
              </AnimatedButton>
              <AnimatedButton
                className="h-full w-1/2 text-right"
                animationDuration={500}
                onClick={() => {
                  onArrowRightClick?.();
                }}
              >
                {">"}
              </AnimatedButton>
            </div>
          </motion.div>
        )}
        <div className="border-b-none pointer-events-auto h-full space-y-6 overflow-y-scroll border-x border-t border-textInactiveColor bg-bgColor px-2.5 pb-32 pt-2.5">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

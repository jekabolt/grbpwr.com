"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

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

const sheetVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      y: {
        type: "spring",
        stiffness: 400,
        damping: 35,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 40,
    },
  },
};

export function BottomSheet({
  children,
  mainAreaRef,
  containerRef,
  isCarouselScrolling = false,
  config,
  contentAboveRef,
}: BottomSheetProps) {
  const { containerHeight, canScrollInside } = useBottomSheet({
    mainAreaRef,
    containerRef,
    isCarouselScrolling,
    config,
    contentAboveRef,
  });

  const isOpen = containerHeight > 0;

  return (
    <div className="pointer-events-none absolute inset-0 scroll-smooth">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="bottom-sheet"
            ref={containerRef}
            className="absolute inset-x-2.5 bottom-0 z-30 flex flex-col overflow-hidden"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ height: containerHeight }}
            transition={{
              height: {
                type: "spring",
                stiffness: 2500,
                damping: 100,
                mass: 0.1,
              },
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
        )}
      </AnimatePresence>
    </div>
  );
}

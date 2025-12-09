"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

import { useCart } from "@/lib/stores/cart/store-provider";

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
  className?: string;
}

export function BottomSheet({
  children,
  mainAreaRef,
  containerRef,
  isCarouselScrolling = false,
  config,
  contentAboveRef,
}: BottomSheetProps) {
  const { isOpen } = useCart((state) => state);
  const { containerHeight, canScrollInside } = useBottomSheet({
    mainAreaRef,
    containerRef,
    isCarouselScrolling,
    config,
    contentAboveRef,
  });

  return (
    <div className="pointer-events-none absolute inset-0 scroll-smooth">
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
          stiffness: 2500,
          damping: 100,
          mass: 0.1,
        }}
      >
        <div className="border-b-none pointer-events-auto h-full space-y-6 overflow-y-scroll border-x border-t border-textInactiveColor bg-bgColor px-2.5 pb-32 pt-2.5">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

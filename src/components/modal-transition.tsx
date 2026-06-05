"use client";

import React, { type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const modalTransition = {
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1] as const,
};

export type SlideFrom = "left" | "right" | "top" | "bottom" | "none";

const slide = (axis: "x" | "y", from: number) => ({
  initial: { opacity: 0, [axis]: from },
  animate: { opacity: 1, [axis]: 0 },
  exit: { opacity: 0, [axis]: from },
});

const getSlideAnimation = (from: SlideFrom) => {
  if (from === "none") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  const axis = from === "top" || from === "bottom" ? "y" : "x";
  const offset = from === "left" || from === "top" ? -20 : 20;
  return slide(axis, offset);
};

interface ModalTransitionProps {
  isOpen: boolean;
  content?: ReactNode;
  contentSlideFrom?: SlideFrom;
  contentClassName?: string;
  contentStyle?: CSSProperties;
}

export function ModalTransition({
  isOpen,
  content,
  contentSlideFrom = "right",
  contentClassName,
  contentStyle,
}: ModalTransitionProps) {
  const animation = getSlideAnimation(contentSlideFrom);
  return (
    <AnimatePresence>
      {isOpen && content != null && (
        <motion.div
          key="modal-content"
          {...({
            initial: animation.initial,
            animate: animation.animate,
            exit: animation.exit,
            transition: modalTransition,
            className: contentClassName,
            style: contentStyle,
          } as React.ComponentProps<typeof motion.div>)}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

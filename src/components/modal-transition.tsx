"use client";

import type { ReactNode } from "react";
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

const slideVariants = {
  left: slide("x", -20),
  right: slide("x", 20),
  top: slide("y", -20),
  bottom: slide("y", 20),
  none: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

interface ModalTransitionProps {
  isOpen: boolean;
  content?: ReactNode;
  contentSlideFrom?: SlideFrom;
  contentClassName?: string;
}

export function ModalTransition({
  isOpen,
  content,
  contentSlideFrom = "right",
  contentClassName,
}: ModalTransitionProps) {
  const contentVariants = slideVariants[contentSlideFrom];
  return (
    <AnimatePresence>
      {isOpen && content != null && (
        <motion.div
          key="modal-content"
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={modalTransition}
          className={contentClassName}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

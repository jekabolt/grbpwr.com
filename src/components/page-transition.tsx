"use client";

import { ReactNode, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { modalTransition } from "@/components/modal-transition";

interface PageTransitionProps {
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="min-h-0 w-full"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={modalTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

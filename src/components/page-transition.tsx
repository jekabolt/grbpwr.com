"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
}


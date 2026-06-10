"use client";

import { MotionConfig } from "framer-motion";

/**
 * Client wrapper around framer-motion's MotionConfig.
 *
 * Importing the framer-motion barrel (a "use client" module that re-exports with
 * `export *`) directly into the Server Component layout fails Next's flight loader
 * with "It's currently unsupported to use 'export *' in a client boundary."
 * Isolating the import behind this "use client" component keeps it inside the
 * client bundle.
 *
 * reducedMotion="user" makes every framer-motion animation (modal slides,
 * bottom-sheet spring) honor the OS setting; CSS animations are covered by the
 * reduced-motion block in globals.css.
 */
export function MotionConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

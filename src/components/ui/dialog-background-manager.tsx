"use client";

import { useLayoutEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

/**
 * Temporarily changes theme-color meta AND html/body background when dialog is open.
 * - theme-color: controls iOS Safari status bar (top)
 * - html/body background: controls home indicator area (bottom) on iPhone 15+
 *
 * Uses useLayoutEffect to ensure changes happen synchronously before paint.
 */
export function DialogBackgroundManager({
  isOpen,
  backgroundColor = "#000000",
}: DialogBackgroundManagerProps) {
  const originalThemeColor = useRef<string | null>(null);
  const wasOpen = useRef(false);

  // useLayoutEffect runs synchronously before browser paint
  useLayoutEffect(() => {
    if (isOpen && !wasOpen.current) {
      // Signal ThemeColorManager to skip updates FIRST (prevent race condition)
      document.body.dataset.dialogOpen = "true";
      wasOpen.current = true;

      // Update theme-color for status bar (top)
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        originalThemeColor.current = themeColorMeta.getAttribute("content");
        themeColorMeta.setAttribute("content", backgroundColor);
      }

      // Set html/body background for bottom safe area (iPhone 15+)
      document.documentElement.style.setProperty(
        "background-color",
        backgroundColor,
        "important",
      );
      document.body.style.setProperty(
        "background-color",
        backgroundColor,
        "important",
      );
    } else if (!isOpen && wasOpen.current) {
      // Closing: remove overrides
      delete document.body.dataset.dialogOpen;
      wasOpen.current = false;

      // Remove inline background styles - CSS will take over
      document.documentElement.style.removeProperty("background-color");
      document.body.style.removeProperty("background-color");

      // Restore theme-color
      if (originalThemeColor.current !== null) {
        const themeColorMeta = document.querySelector(
          'meta[name="theme-color"]',
        );
        if (themeColorMeta) {
          themeColorMeta.setAttribute("content", originalThemeColor.current);
        }
        originalThemeColor.current = null;
      }
    }

    return () => {
      if (wasOpen.current) {
        delete document.body.dataset.dialogOpen;
        document.documentElement.style.removeProperty("background-color");
        document.body.style.removeProperty("background-color");

        if (originalThemeColor.current !== null) {
          const themeColorMeta = document.querySelector(
            'meta[name="theme-color"]',
          );
          if (themeColorMeta) {
            themeColorMeta.setAttribute("content", originalThemeColor.current);
          }
        }
      }
    };
  }, [isOpen, backgroundColor]);

  return null;
}

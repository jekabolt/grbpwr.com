"use client";

import { useLayoutEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

/**
 * Temporarily changes theme-color meta AND html/body background when dialog is open.
 * - theme-color: controls iOS Safari status bar (top)
 * - CSS class on html: controls home indicator area (bottom) on iPhone 15+
 *
 * Uses useLayoutEffect to ensure changes happen synchronously before paint.
 */
export function DialogBackgroundManager({
  isOpen,
  backgroundColor = "#000000",
}: DialogBackgroundManagerProps) {
  const originalThemeColor = useRef<string | null>(null);
  const wasOpen = useRef(false);

  // Determine which CSS class to use based on background color
  const isDark =
    backgroundColor === "#000000" ||
    backgroundColor === "#000" ||
    backgroundColor === "black";

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

      // Add CSS class to html for bottom safe area (iOS Safari)
      // This is more reliable than inline styles on iOS
      if (isDark) {
        document.documentElement.classList.add("dialog-dark-bg");
      }
    } else if (!isOpen && wasOpen.current) {
      // Closing: remove overrides
      delete document.body.dataset.dialogOpen;
      wasOpen.current = false;

      // Remove CSS class
      document.documentElement.classList.remove("dialog-dark-bg");

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
        document.documentElement.classList.remove("dialog-dark-bg");

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
  }, [isOpen, backgroundColor, isDark]);

  return null;
}

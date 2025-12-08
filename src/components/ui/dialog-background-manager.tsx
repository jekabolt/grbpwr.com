"use client";

import { useEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

/**
 * Temporarily changes theme-color meta when dialog is open
 * to fix iPhone Safari status bar color in safe areas
 */
export function DialogBackgroundManager({
  isOpen,
  backgroundColor = "#000000",
}: DialogBackgroundManagerProps) {
  const originalThemeColor = useRef<string | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      // Opening: save and update theme-color
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        originalThemeColor.current = themeColorMeta.getAttribute("content");
        themeColorMeta.setAttribute("content", backgroundColor);
      }

      // Signal ThemeColorManager to skip updates
      document.body.dataset.dialogOpen = "true";
      wasOpen.current = true;
    } else if (!isOpen && wasOpen.current) {
      // Closing: restore theme-color
      delete document.body.dataset.dialogOpen;

      if (originalThemeColor.current !== null) {
        const themeColorMeta = document.querySelector(
          'meta[name="theme-color"]',
        );
        if (themeColorMeta) {
          themeColorMeta.setAttribute("content", originalThemeColor.current);
        }
        originalThemeColor.current = null;
      }

      wasOpen.current = false;
    }

    return () => {
      if (wasOpen.current) {
        delete document.body.dataset.dialogOpen;

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

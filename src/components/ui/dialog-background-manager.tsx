"use client";

import { useEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

/**
 * Temporarily changes body/html background and theme-color meta when dialog is open
 * to fix iPhone safe area colors in iOS Safari
 */
export function DialogBackgroundManager({
  isOpen,
  backgroundColor = "#000000",
}: DialogBackgroundManagerProps) {
  const originalBodyBg = useRef<string | null>(null);
  const originalHtmlBg = useRef<string | null>(null);
  const originalThemeColor = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save original backgrounds
      if (originalBodyBg.current === null) {
        originalBodyBg.current = window.getComputedStyle(
          document.body,
        ).backgroundColor;
      }
      if (originalHtmlBg.current === null) {
        originalHtmlBg.current = window.getComputedStyle(
          document.documentElement,
        ).backgroundColor;
      }

      // Save and update theme-color meta (for iOS Safari status bar)
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        if (originalThemeColor.current === null) {
          originalThemeColor.current = themeColorMeta.getAttribute("content");
        }
        themeColorMeta.setAttribute("content", backgroundColor);
      }

      // Set data attribute to signal ThemeColorManager to skip updates
      document.body.dataset.dialogOpen = "true";

      // Set new background colors
      document.body.style.backgroundColor = backgroundColor;
      document.documentElement.style.backgroundColor = backgroundColor;
    } else {
      // Remove dialog open signal
      delete document.body.dataset.dialogOpen;

      // Restore original backgrounds when dialog closes
      if (originalBodyBg.current !== null) {
        document.body.style.backgroundColor = originalBodyBg.current;
        originalBodyBg.current = null;
      }
      if (originalHtmlBg.current !== null) {
        document.documentElement.style.backgroundColor = originalHtmlBg.current;
        originalHtmlBg.current = null;
      }

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

    // Cleanup on unmount
    return () => {
      delete document.body.dataset.dialogOpen;

      if (originalBodyBg.current !== null) {
        document.body.style.backgroundColor = originalBodyBg.current;
      }
      if (originalHtmlBg.current !== null) {
        document.documentElement.style.backgroundColor = originalHtmlBg.current;
      }
      if (originalThemeColor.current !== null) {
        const themeColorMeta = document.querySelector(
          'meta[name="theme-color"]',
        );
        if (themeColorMeta) {
          themeColorMeta.setAttribute("content", originalThemeColor.current);
        }
      }
    };
  }, [isOpen, backgroundColor]);

  return null;
}

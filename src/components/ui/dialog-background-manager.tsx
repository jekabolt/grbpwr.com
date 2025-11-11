"use client";

import { useEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

/**
 * Temporarily changes body/html background when dialog is open
 * to fix iPhone safe area colors
 */
export function DialogBackgroundManager({
  isOpen,
  backgroundColor = "#000000",
}: DialogBackgroundManagerProps) {
  const originalBodyBg = useRef<string | null>(null);
  const originalHtmlBg = useRef<string | null>(null);

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

      // Set new background colors
      document.body.style.backgroundColor = backgroundColor;
      document.documentElement.style.backgroundColor = backgroundColor;
    } else {
      // Restore original backgrounds when dialog closes
      if (originalBodyBg.current !== null) {
        document.body.style.backgroundColor = originalBodyBg.current;
        originalBodyBg.current = null;
      }
      if (originalHtmlBg.current !== null) {
        document.documentElement.style.backgroundColor = originalHtmlBg.current;
        originalHtmlBg.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (originalBodyBg.current !== null) {
        document.body.style.backgroundColor = originalBodyBg.current;
      }
      if (originalHtmlBg.current !== null) {
        document.documentElement.style.backgroundColor = originalHtmlBg.current;
      }
    };
  }, [isOpen, backgroundColor]);

  return null;
}

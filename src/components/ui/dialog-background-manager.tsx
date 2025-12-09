"use client";

import { useLayoutEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

function forceSafariRepaint() {
  void document.body.offsetHeight;
  void document.documentElement.offsetHeight;
  const x = window.scrollX;
  const y = window.scrollY;
  window.scrollTo(x, y + 1);
  requestAnimationFrame(() => {
    window.scrollTo(x, y);
  });
}

function applyDarkBackground(color: string) {
  // Use window.outerHeight for iOS 18+ Liquid Glass support
  const outerHeight = window.outerHeight;

  // Set HTML background first (covers safe area)
  document.documentElement.style.backgroundColor = color;
  document.documentElement.style.minHeight = `${outerHeight}px`;

  // Set body background
  document.body.style.backgroundColor = color;
  document.body.style.minHeight = `${outerHeight}px`;

  // Force layout recalc
  void document.documentElement.offsetHeight;
  void document.body.offsetHeight;

  document.querySelectorAll("body > *").forEach((el) => {
    const element = el as HTMLElement;

    const isRadixPortal = element.hasAttribute("data-radix-portal");
    const hasDialogContent = element.querySelector(
      "[data-radix-dialog-content]",
    );
    const hasDialogOverlay = element.querySelector(
      "[data-radix-dialog-overlay]",
    );
    const isScript =
      element.tagName === "SCRIPT" || element.tagName === "STYLE";

    if (!isRadixPortal && !hasDialogContent && !hasDialogOverlay && !isScript) {
      element.dataset.hiddenForDialog = "true";
      element.style.visibility = "hidden";
    }
  });

  // Multiple repaints for iOS safe area
  forceSafariRepaint();
  requestAnimationFrame(() => {
    forceSafariRepaint();
  });
}

function removeDarkBackground() {
  document.body.style.removeProperty("background-color");
  document.body.style.removeProperty("min-height");
  document.documentElement.style.removeProperty("background-color");
  document.documentElement.style.removeProperty("min-height");

  document.querySelectorAll('[data-hidden-for-dialog="true"]').forEach((el) => {
    const element = el as HTMLElement;
    element.style.removeProperty("visibility");
    delete element.dataset.hiddenForDialog;
  });

  forceSafariRepaint();
}

export function DialogBackgroundManager({
  isOpen,
  backgroundColor = "#000000",
}: DialogBackgroundManagerProps) {
  const effectRan = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useLayoutEffect(() => {
    if (isOpen) {
      const applyBackground = () => {
        const portalExists = document.querySelector(
          "[data-radix-portal], [data-radix-dialog-content]",
        );

        if (portalExists) {
          applyDarkBackground(backgroundColor);
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      };

      applyBackground();

      observerRef.current = new MutationObserver(() => {
        applyBackground();
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: false,
      });

      effectRan.current = true;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        if (effectRan.current) {
          removeDarkBackground();
          effectRan.current = false;
        }
      };
    }
  }, [isOpen, backgroundColor]);

  return null;
}

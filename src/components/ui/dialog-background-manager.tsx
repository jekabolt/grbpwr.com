"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

function setViewportHeight() {
  // Use innerHeight for content area, not outerHeight
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
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
  // Update viewport height
  setViewportHeight();

  // Apply background to html first (critical for safe area)
  document.documentElement.style.backgroundColor = color;
  document.body.style.backgroundColor = color;

  // Prevent body scroll on iOS
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.height = "100%";

  // Force layout recalc
  void document.documentElement.offsetHeight;

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

  forceSafariRepaint();
}

function removeDarkBackground() {
  document.body.style.removeProperty("background-color");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("position");
  document.body.style.removeProperty("width");
  document.body.style.removeProperty("height");
  document.documentElement.style.removeProperty("background-color");

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

  // Update --vh on resize
  useEffect(() => {
    setViewportHeight();

    const handleResize = () => setViewportHeight();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

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

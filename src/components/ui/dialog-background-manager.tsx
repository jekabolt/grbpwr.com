"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

interface DialogBackgroundManagerProps {
  isOpen: boolean;
  backgroundColor?: string;
}

function setViewportHeight() {
  // Safari 26 требует visualViewport для корректной работы
  if (window.visualViewport) {
    const vh = window.visualViewport.height * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    // Также устанавливаем полную высоту напрямую
    document.documentElement.style.setProperty(
      "--full-height",
      `${window.visualViewport.height}px`,
    );
  } else {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty(
      "--full-height",
      `${window.innerHeight}px`,
    );
  }
}

function forceSafariRepaint() {
  void document.body.offsetHeight;
  void document.documentElement.offsetHeight;

  // Дополнительный forced reflow для Safari 26
  const dummy = document.documentElement.scrollTop;
  void dummy;

  const x = window.scrollX;
  const y = window.scrollY;
  window.scrollTo(x, y + 1);
  requestAnimationFrame(() => {
    window.scrollTo(x, y);
  });
}

function applyDarkBackground(color: string) {
  // Update viewport height FIRST
  setViewportHeight();

  // Safari 26: apply to documentElement first for safe area coverage
  document.documentElement.style.backgroundColor = color;
  document.documentElement.style.minHeight = "var(--full-height, 100vh)";

  document.body.style.backgroundColor = color;
  document.body.style.minHeight = "var(--full-height, 100vh)";

  // Critical for Safari 26: prevent scroll with explicit positioning
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.height = "var(--full-height, 100vh)";
  document.body.style.top = "0";
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.bottom = "0";

  // Safari 26: force immediate paint
  void document.documentElement.getBoundingClientRect();
  void document.body.getBoundingClientRect();

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

  // Multiple repaints for Safari 26
  forceSafariRepaint();
  requestAnimationFrame(() => {
    forceSafariRepaint();
  });
}

function removeDarkBackground() {
  document.documentElement.style.removeProperty("background-color");
  document.documentElement.style.removeProperty("min-height");

  document.body.style.removeProperty("background-color");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("position");
  document.body.style.removeProperty("width");
  document.body.style.removeProperty("height");
  document.body.style.removeProperty("min-height");
  document.body.style.removeProperty("top");
  document.body.style.removeProperty("left");
  document.body.style.removeProperty("right");
  document.body.style.removeProperty("bottom");

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

  // Safari 26: track visualViewport changes
  useEffect(() => {
    setViewportHeight();

    const handleResize = () => {
      setViewportHeight();
      // Force repaint after resize in Safari 26
      if (isOpen) {
        requestAnimationFrame(() => {
          forceSafariRepaint();
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Safari 26 critical: visualViewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      }
    };
  }, [isOpen]);

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

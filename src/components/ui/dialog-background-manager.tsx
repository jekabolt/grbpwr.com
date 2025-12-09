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
  // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: используем CSS переменную
  document.documentElement.style.setProperty("--background", color);
  document.body.style.backgroundColor = color;
  document.documentElement.style.backgroundColor = color;

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
  // Восстанавливаем исходный цвет из :root или .blackTheme
  const isDark = document.body.classList.contains("blackTheme");
  const originalColor = isDark ? "#000" : "#fff";

  document.documentElement.style.setProperty("--background", originalColor);
  document.body.style.removeProperty("background-color");
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

  useLayoutEffect(() => {
    if (isOpen) {
      const applyBackground = () => {
        const portalExists = document.querySelector(
          "[data-radix-portal], [data-radix-dialog-content]",
        );

        if (portalExists) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              applyDarkBackground(backgroundColor);
            });
          });

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

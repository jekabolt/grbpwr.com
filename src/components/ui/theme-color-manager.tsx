"use client";

import { useEffect } from "react";

export function ThemeColorManager() {
  useEffect(() => {
    const updateThemeColor = () => {
      // Skip updates when DialogBackgroundManager is controlling theme-color
      if (document.body.dataset.dialogOpen === "true") {
        return;
      }

      const hasBlackTheme =
        document.body.classList.contains("blackTheme") ||
        document.documentElement.classList.contains("blackTheme") ||
        document.querySelector(".blackTheme") !== null;

      const backgroundColor = hasBlackTheme ? "#000000" : "#ffffff";
      const appleStatusBarStyle = hasBlackTheme
        ? "black-translucent"
        : "default";

      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", backgroundColor);
      } else {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.setAttribute("name", "theme-color");
        metaThemeColor.setAttribute("content", backgroundColor);
        document.head.appendChild(metaThemeColor);
      }

      let appleStatusBar = document.querySelector(
        'meta[name="apple-mobile-web-app-status-bar-style"]',
      );
      if (appleStatusBar) {
        appleStatusBar.setAttribute("content", appleStatusBarStyle);
      } else {
        appleStatusBar = document.createElement("meta");
        appleStatusBar.setAttribute(
          "name",
          "apple-mobile-web-app-status-bar-style",
        );
        appleStatusBar.setAttribute("content", appleStatusBarStyle);
        document.head.appendChild(appleStatusBar);
      }
    };

    updateThemeColor();

    const observer = new MutationObserver(updateThemeColor);

    // Watch for class changes and data-dialog-open attribute
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-dialog-open"],
      subtree: true,
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

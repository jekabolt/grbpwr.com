"use client";

import { useEffect } from "react";

export function ThemeColorManager() {
  useEffect(() => {
    const updateThemeColor = () => {
      // Check if body or any parent has blackTheme class
      const hasBlackTheme =
        document.body.classList.contains("blackTheme") ||
        document.documentElement.classList.contains("blackTheme") ||
        document.querySelector(".blackTheme") !== null;

      // Get computed CSS variable value
      const backgroundColor = hasBlackTheme ? "#000000" : "#ffffff";
      const appleStatusBarStyle = hasBlackTheme
        ? "black-translucent"
        : "default";

      // Update meta theme-color
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", backgroundColor);
      } else {
        // Create if doesn't exist
        metaThemeColor = document.createElement("meta");
        metaThemeColor.setAttribute("name", "theme-color");
        metaThemeColor.setAttribute("content", backgroundColor);
        document.head.appendChild(metaThemeColor);
      }

      // Update Apple status bar style
      let appleStatusBar = document.querySelector(
        'meta[name="apple-mobile-web-app-status-bar-style"]',
      );
      if (appleStatusBar) {
        appleStatusBar.setAttribute("content", appleStatusBarStyle);
      } else {
        // Create if doesn't exist
        appleStatusBar = document.createElement("meta");
        appleStatusBar.setAttribute(
          "name",
          "apple-mobile-web-app-status-bar-style",
        );
        appleStatusBar.setAttribute("content", appleStatusBarStyle);
        document.head.appendChild(appleStatusBar);
      }
    };

    // Initial update
    updateThemeColor();

    // Watch for class changes on body and document
    const observer = new MutationObserver(updateThemeColor);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

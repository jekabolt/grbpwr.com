"use client";

import { useEffect } from "react";

export function ThemeColorManager({ color }: { color: string }) {
  useEffect(() => {
    // Update or create theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.setAttribute("content", color);
  }, [color]);

  return null;
}

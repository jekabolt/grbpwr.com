"use client";

import { useEffect, useRef } from "react";

export function HeroBackground({ imageUrl }: { imageUrl?: string }) {
  const hasSet = useRef(false);

  useEffect(() => {
    if (!imageUrl || hasSet.current) return;

    // Start loading immediately
    const img = new Image();
    img.crossOrigin = "anonymous";

    const extractAndSetColor = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = 1;

        // Draw only the last pixel line
        ctx.drawImage(img, 0, img.height - 1, img.width, 1, 0, 0, img.width, 1);

        // Get the average color from the last line
        const imageData = ctx.getImageData(0, 0, canvas.width, 1);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        const bgColor = `rgb(${r}, ${g}, ${b})`;
        document.body.style.backgroundColor = bgColor;
        document.documentElement.style.backgroundColor = bgColor;
        hasSet.current = true;
      } catch (error) {
        console.error("Failed to extract background color:", error);
      }
    };

    img.onload = extractAndSetColor;
    img.onerror = () => {
      console.error("Failed to load hero image for background extraction");
    };

    // Preload hint for faster loading
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = imageUrl;
    document.head.appendChild(preloadLink);

    img.src = imageUrl;

    return () => {
      preloadLink.remove();
      if (hasSet.current) {
        document.body.style.backgroundColor = "#000";
        document.documentElement.style.backgroundColor = "#000";
      }
    };
  }, [imageUrl]);

  return null;
}

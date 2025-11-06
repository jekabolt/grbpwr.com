"use client";

import { useEffect, useRef } from "react";

export function HeroBackground({ imageUrl }: { imageUrl?: string }) {
  const hasSet = useRef(false);
  const styleElementRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!imageUrl || hasSet.current) return;

    // Use Next.js image optimization endpoint to bypass CORS
    const nextImageUrl = `/_next/image?url=${encodeURIComponent(imageUrl)}&w=1920&q=75`;

    // Start loading immediately
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        // Create canvas to extract color from top corner
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        // Sample a small area from the top corner (e.g., 50x50px from top-left)
        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        // Draw the top corner portion of the image
        ctx.drawImage(
          img,
          0,
          0,
          sampleSize,
          sampleSize, // source: top-left corner
          0,
          0,
          sampleSize,
          sampleSize, // destination: full canvas
        );

        // Get the average color from the sampled area
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0;
        const pixelCount = sampleSize * sampleSize;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        // Account for overlay rgba(0, 0, 0, 0.4) - blend with 40% black overlay
        // Formula: result = base * (1 - overlay_alpha) + overlay * overlay_alpha
        // Since overlay is black (0,0,0), this simplifies to: result = base * 0.6
        const overlayAlpha = 0.4;
        r = Math.round(r * (1 - overlayAlpha));
        g = Math.round(g * (1 - overlayAlpha));
        b = Math.round(b * (1 - overlayAlpha));

        // Convert to hex
        const hexColor = `#${[r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")}`;

        // Create or update style element for pseudo-element
        if (!styleElementRef.current) {
          styleElementRef.current = document.createElement("style");
          document.head.appendChild(styleElementRef.current);
        }

        // Apply color to top 50% using pseudo-element
        styleElementRef.current.textContent = `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 50vh;
            background-color: ${hexColor};
            z-index: -1;
            pointer-events: none;
          }
        `;

        document.documentElement.style.setProperty("--hero-bg-color", hexColor);
        hasSet.current = true;
      } catch (error) {
        console.error("Error extracting color from image:", error);
      }
    };

    img.onerror = () => {
      console.error("Failed to load image for color extraction");
    };

    img.src = nextImageUrl;

    // Cleanup: remove style element when component unmounts (navigating away from main page)
    return () => {
      if (styleElementRef.current) {
        styleElementRef.current.remove();
        styleElementRef.current = null;
      }
      document.documentElement.style.removeProperty("--hero-bg-color");
      hasSet.current = false;
    };
  }, [imageUrl]);

  return null;
}

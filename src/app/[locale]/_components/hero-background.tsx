"use client";

import { useEffect, useRef } from "react";

interface HeroBackgroundProps {
  imageUrl?: string;
}

/**
 * Extract average RGB color from top-left corner of an image.
 * Applies a dark overlay blend to simulate CSS overlay effect.
 */
async function extractAverageColorWithOverlay(
  imageUrl: string,
  overlayAlpha = 0.4,
  sampleSize = 50,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          sampleSize,
          sampleSize,
          0,
          0,
          sampleSize,
          sampleSize,
        );

        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

        let r = 0,
          g = 0,
          b = 0;
        const pixelCount = sampleSize * sampleSize;
        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
        }

        r = Math.round((r / pixelCount) * (1 - overlayAlpha));
        g = Math.round((g / pixelCount) * (1 - overlayAlpha));
        b = Math.round((b / pixelCount) * (1 - overlayAlpha));

        const toHex = (v: number) => v.toString(16).padStart(2, "0");
        resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () =>
      reject(new Error("Failed to load image for color extraction"));
    img.src = imageUrl;
  });
}

export function HeroBackground({ imageUrl }: HeroBackgroundProps) {
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  const originalBodyBg = useRef<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const nextImageUrl = `/_next/image?url=${encodeURIComponent(imageUrl)}&w=1920&q=75`;

    // Prevent duplicate style insertions
    if (styleElementRef.current) return;

    let isMounted = true;

    // Save original body background for cleanup
    originalBodyBg.current = window.getComputedStyle(
      document.body,
    ).backgroundColor;

    extractAverageColorWithOverlay(nextImageUrl)
      .then((hexColor) => {
        if (!isMounted || !hexColor) return;

        // Create and append style element if not already created
        if (!styleElementRef.current) {
          const styleEl = document.createElement("style");
          styleElementRef.current = styleEl;
          document.head.appendChild(styleEl);
        }

        // html::before = top 50vh with extracted color
        // html::after = bottom 50vh with white (covers the colored body)
        // body = extracted color (for Safari bar/overscroll)
        styleElementRef.current.textContent = `
          html::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100vw;
            height: 50vh;
            min-height: 50vh;
            background-color: ${hexColor};
            z-index: -9999;
            pointer-events: none;
            display: block;
          }
          html::after {
            content: "";
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100vw;
            height: 50vh;
            min-height: 50vh;
            background-color: #fff;
            z-index: -9999;
            pointer-events: none;
            display: block;
          }
          @supports (height: 50dvh) {
            html::before {
              height: 50dvh;
              min-height: 50dvh;
            }
            html::after {
              height: 50dvh;
              min-height: 50dvh;
            }
          }
        `;

        // Set body background for Safari bar coloring
        document.body.style.backgroundColor = hexColor;

        // Set data attribute for DialogBackgroundManager coordination
        document.body.setAttribute("data-hero-bg-color", hexColor);
      })
      .catch((error) =>
        console.error("HeroBackground color extraction error:", error),
      );

    return () => {
      isMounted = false;

      if (styleElementRef.current) {
        styleElementRef.current.remove();
        styleElementRef.current = null;
      }
      document.body.style.backgroundColor = originalBodyBg.current || "";
      document.body.removeAttribute("data-hero-bg-color");
    };
  }, [imageUrl]);

  return null;
}

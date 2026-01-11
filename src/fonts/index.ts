import localFont from "next/font/local";

export const FeatureMono = localFont({
  src: [
    {
      path: "./FeatureMono-Thin.ttf",
      weight: "100 300",
      style: "normal",
    },
    {
      path: "./FeatureMono-Regular.ttf",
      weight: "400 500",
      style: "normal",
    },
    {
      path: "./FeatureMono-Bold.ttf",
      weight: "600 900",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "Menlo", "Monaco", "Cascadia Mono", "Courier New", "monospace"],
  adjustFontFallback: false,
  variable: "--font-feature-mono",
});

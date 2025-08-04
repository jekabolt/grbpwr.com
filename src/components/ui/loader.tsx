"use client";

import { useEffect, useState } from "react";

import { Text } from "./text";

interface LoaderProps {
  type?: "default" | "order-processing";
}

export function Loader({ type = "default" }: LoaderProps) {
  const [loadingTextIndex, setLoadingTextIndex] = useState<number>(0);

  const loadingTexts = [
    "Placing order",
    "Checking availability",
    "Stock reservation",
  ];

  useEffect(() => {
    if (type === "order-processing") {
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [type, loadingTexts.length]);

  if (type === "order-processing") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 animate-[infinite-loading_2s_ease-in-out_infinite] bg-textColor" />
        <Text className="relative z-10">{loadingTexts[loadingTextIndex]}</Text>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center p-2">
      <div className="relative h-[0.5px] w-full overflow-hidden bg-gray-200/20 lg:w-[175px]">
        <div className="absolute left-0 top-0 h-full w-full animate-[loading_1s_ease-out_forwards] bg-textColor" />
      </div>
    </div>
  );
}

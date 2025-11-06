"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Text } from "./text";

interface LoaderProps {
  type?: "default" | "order-processing" | "overlay";
  reverse?: boolean;
  children?: React.ReactNode;
}

export function Loader({
  type = "default",
  reverse = false,
  children,
}: LoaderProps) {
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

  if (type === "overlay") {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <div
            className={cn(
              "absolute left-0 top-0 h-full w-full bg-textColor",
              reverse
                ? "animate-[loading-reverse_1s_ease-out_forwards]"
                : "animate-[loading_1s_ease-out_forwards]",
            )}
          />
        </div>
        {children && (
          <div className="relative z-50 text-bgColor">{children}</div>
        )}
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

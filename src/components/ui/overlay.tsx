"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

let overflowLockCount = 0;

interface Props {
  cover: "screen" | "container";
  color?: "dark" | "light" | "highlight";
  disablePointerEvents?: boolean;
  trigger?: "hover" | "held" | "active" | "none";
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function Overlay({
  cover,
  color = "dark",
  disablePointerEvents = true,
  trigger = "none",
  active = false,
  disabled = false,
  onClick,
}: Props) {
  useEffect(() => {
    if (cover !== "screen") return;
    overflowLockCount++;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      overflowLockCount--;
      if (overflowLockCount === 0) {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [cover]);

  return (
    <div
      className={cn("inset-0", {
        "pointer-events-none z-10": disablePointerEvents,
        "bg-overlay": color === "dark",
        "bg-white/50": color === "light",
        "bg-highlightColor mix-blend-screen": color === "highlight",
        "transform-gpu": color === "highlight" && cover === "container",
        fixed: cover === "screen",
        "z-30 h-screen": cover === "screen",
        // Container-sized overlay must NOT use h-screen — that ties height to the viewport
        // and breaks absolute positioning inside small relative parents (cart thumb, lightbox).
        "absolute h-full w-full min-h-0": cover === "container",
        "transition-opacity duration-[400ms] ease-out": trigger !== "none",
        "opacity-0 group-hover:opacity-60": trigger === "hover",
        "opacity-0 group-data-[held=true]:opacity-60": trigger === "held",
        "opacity-0": trigger === "active" && !active,
        "opacity-60": trigger === "active" && active,
        "bg-textInactiveColor": disabled,
      })}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "./button";

type BaseButtonProps = {
  children: React.ReactNode;
  className?: string;
  animationArea?: "text" | "container" | "text-no-underline" | "full-underline";
  animationDuration?: number;
  [k: string]: unknown;
};

type RegularButtonProps = BaseButtonProps & {
  href?: never;
  onClick?: () => void;
};

type LinkButtonProps = BaseButtonProps & {
  href: string;
  onClick?: () => void;
};

type AnimatedButtonProps = RegularButtonProps | LinkButtonProps;

export function AnimatedButton({
  children,
  className,
  animationArea = "container",
  animationDuration = 5000,
  href,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePress = () => {
    setIsPressed(true);
    if (onClick) {
      onClick();
    }
    setTimeout(() => setIsPressed(false), animationDuration);
  };

  const handleTouchStart = () => {
    // Start the threshold animation after a short delay to detect press and hold
    holdTimeoutRef.current = setTimeout(() => {
      setIsHeld(true);
    }, 100);
  };

  const handleTouchEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    // Reset after animation completes
    setTimeout(() => setIsHeld(false), 400);
  };

  const handleTouchCancel = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setIsHeld(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  if (href) {
    return (
      <Button
        {...props}
        asChild
        className={cn(
          "relative select-none",
          {
            "bg-bgColor opacity-50": isPressed && animationArea === "container",
            underline: isPressed && animationArea === "text",
            "border-b border-textColor":
              isPressed && animationArea === "full-underline",
            "animate-threshold": isHeld,
          },
          className,
        )}
        onClick={handlePress}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        disabled={isPressed}
      >
        <Link href={href || ""} className="relative">
          {children}
          {isHeld && (
            <span
              className="duration-400 pointer-events-none absolute inset-0 z-10 bg-highlightColor opacity-60 mix-blend-screen transition-opacity ease-out"
              aria-hidden="true"
            />
          )}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      {...props}
      className={cn(
        "relative select-none",
        {
          "bg-bgColor opacity-50": isPressed && animationArea === "container",
          underline: isPressed && animationArea === "text",
          "border-b border-textColor":
            isPressed && animationArea === "full-underline",
          "underline-none": isPressed && animationArea === "text-no-underline",
          "animate-threshold": isHeld,
        },
        className,
      )}
      onClick={handlePress}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      disabled={isPressed}
    >
      {children}
      {isHeld && (
        <span
          className="duration-400 pointer-events-none absolute inset-0 z-10 bg-highlightColor opacity-60 mix-blend-screen transition-opacity ease-out"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}

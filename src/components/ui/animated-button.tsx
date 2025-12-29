"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "./button";

type BaseButtonProps = {
  children: React.ReactNode;
  className?: string;
  animationArea?: "text" | "container" | "text-no-underline" | "full-underline";
  animationDuration?: number;
  enableThresholdAnimation?: boolean;
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
  enableThresholdAnimation = false,
  href,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHeld, setIsHeld] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth < 768,
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handlePress = () => {
    if (!enableThresholdAnimation) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), animationDuration);
    }
    if (onClick) {
      onClick();
    }
  };

  const handleTouchEnd = () => {
    // Reset the held state on touch end
    setIsHeld(false);
  };

  const handleTouchCancel = () => {
    setIsHeld(false);
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    // This fires when native preview bar is actually opening
    if (isMobile && enableThresholdAnimation) {
      setIsHeld(true);
      // Keep it visible while the context menu is open
    }
  };

  const buttonClasses = cn(
    "select-none transition-all duration-300 ease-in-out [-webkit-tap-highlight-color:transparent]",
    {
      "bg-bgColor opacity-50": isPressed && animationArea === "container",
      underline: isPressed && animationArea === "text",
      "border-b border-textColor":
        isPressed && animationArea === "full-underline",
      "underline-none": isPressed && animationArea === "text-no-underline",
    },
    className,
  );

  if (href) {
    return (
      <Button
        {...props}
        asChild
        className={buttonClasses}
        onClick={handlePress}
        disabled={!enableThresholdAnimation && isPressed}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onContextMenu={handleContextMenu}
        data-held={isHeld}
      >
        <Link href={href || ""}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      {...props}
      className={buttonClasses}
      onClick={handlePress}
      disabled={!enableThresholdAnimation && isPressed}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onContextMenu={handleContextMenu}
      data-held={isHeld}
    >
      {children}
    </Button>
  );
}

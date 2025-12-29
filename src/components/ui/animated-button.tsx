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
  const [showThreshold, setShowThreshold] = useState(false);

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
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePress = () => {
    setIsPressed(true);
    if (onClick) {
      onClick();
    }
    setTimeout(() => setIsPressed(false), animationDuration);
  };

  const handleTouchStart = () => {
    if (isMobile && enableThresholdAnimation) {
      setShowThreshold(true);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile && enableThresholdAnimation) {
      setShowThreshold(false);
    }
  };

  const buttonClasses = cn(
    "transition-all duration-300 ease-in-out [-webkit-tap-highlight-color:transparent]",
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
        disabled={isPressed}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        data-threshold-active={
          showThreshold && isMobile && enableThresholdAnimation
        }
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
      disabled={isPressed}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-threshold-active={
        showThreshold && isMobile && enableThresholdAnimation
      }
    >
      {children}
    </Button>
  );
}

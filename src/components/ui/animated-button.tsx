"use client";

import { useState } from "react";
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

  const handlePress = () => {
    setIsPressed(true);
    if (onClick) {
      onClick();
    }
    setTimeout(() => setIsPressed(false), animationDuration);
  };

  if (href) {
    return (
      <Button
        {...props}
        asChild
        className={cn(
          "duration-5000 transition-all ease-in-out",
          {
            "bg-bgColor opacity-50": isPressed && animationArea === "container",
            underline: isPressed && animationArea === "text",
            "border-b border-textColor":
              isPressed && animationArea === "full-underline",
          },
          className,
        )}
        onClick={handlePress}
        disabled={isPressed}
      >
        <Link href={href || ""}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      {...props}
      className={cn(
        "transition-all duration-300 ease-in-out",
        {
          "bg-bgColor opacity-50": isPressed && animationArea === "container",
          underline: isPressed && animationArea === "text",
          "border-b border-textColor":
            isPressed && animationArea === "full-underline",
          "underline-none": isPressed && animationArea === "text-no-underline",
        },
        className,
      )}
      onClick={handlePress}
      disabled={isPressed}
    >
      {children}
    </Button>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "./button";

type BaseButtonProps = {
  children: React.ReactNode;
  className?: string;
  animationArea?: "text" | "container";
  [k: string]: unknown;
};

type RegularButtonProps = BaseButtonProps & {
  href?: never;
  onClick?: () => void;
};

type LinkButtonProps = BaseButtonProps & {
  href: string;
  onClick?: never;
};

type AnimatedButtonProps = RegularButtonProps | LinkButtonProps;

export function AnimatedButton({
  children,
  className,
  animationArea = "container",
  href,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    if (onClick && !href) {
      onClick();
    }
    setTimeout(() => setIsPressed(false), 5000);
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

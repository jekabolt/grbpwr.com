"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "./button";

type BaseButtonProps = {
  children: React.ReactNode;
  className?: string;
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
  href,
  onClick,
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  const animationClass = cn(
    "transition-colors duration-150",
    isPressed && "bg-textInactiveColor opacity-50",
  );
  return (
    <Button
      asChild
      className={cn(animationClass, className)}
      onClick={handlePress}
    >
      <Link href={href || ""}>{children}</Link>
    </Button>
  );
}

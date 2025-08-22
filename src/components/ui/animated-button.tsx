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
  const animationClass =
    "transition-colors focus:bg-textInactiveColor focus:opacity-50 ";
  return (
    <Button asChild className={cn(animationClass, className)}>
      <Link href={href || ""}>{children}</Link>
    </Button>
  );
}

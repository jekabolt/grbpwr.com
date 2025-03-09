import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

import { Loader } from "./loader";

export const buttonVariants = cva("disabled:cursor-not-allowed block", {
  variants: {
    variant: {
      default: ["text-textBaseSize", "disabled:opacity-50"],
      simple: [
        "text-bgColor",
        "bg-textColor",
        "hover:bg-bgColor",
        "hover:text-textColor",
      ],
      simpleReverse: ["text-textColor", "bg-bgColor"],
      main: [
        "border",
        "border-textColor",
        "text-textBaseSize",
        "text-bgColor",
        "disabled:bg-textInactiveColor",
        "bg-textColor",
        "hover:bg-bgColor",
        "hover:text-textColor",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-offset-2",
        "focus:ring-textColor",
        "disabled:bg-textInactiveColor",
        "disabled:text-bgColor",
        "disabled:border-textInactiveColor",
        "leading-4",
        "text-center",
      ],
      secondary: [
        "border",
        "border-textColor",
        "text-textBaseSize",
        "text-textColor",
        "hover:bg-textColor",
        "hover:text-bgColor",
        "disabled:bg-textInactiveColor",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-offset-2",
        "focus:ring-textColor",
        "disabled:bg-textInactiveColor",
        "disabled:text-bgColor",
        "disabled:border-textInactiveColor",
        "leading-4",
        "text-center",
      ],
      underline: [
        "text-textColor",
        "underline",
        "disabled:text-textInactiveColor",
      ],
      underlineReverse: [
        "text-bgColor",
        "underline",
        "disabled:text-textInactiveColor",
      ],
      underlineWithColors: [
        "underline",
        "text-highlightColor",
        "disabled:text-textInactiveColor",
        "visited:text-visitedLinkColor",
      ],
    },
    isLoading: {
      true: ["relative overflow-hidden"],
      false: [],
    },
    size: {
      sm: ["text-textBaseSize"],
      default: ["text-textBaseSize"],
      lg: ["py-2.5", "px-4", "text-textBaseSize"],
      giant: [
        "py-10",
        "px-16",
        "text-textGiantSmallSize",
        "lg:text-textGiantSize",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    isLoading: false,
  },
});

interface Props extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  [k: string]: unknown;
}

export function Button({
  asChild,
  children,
  loading = false,
  size,
  variant,
  className,
  ...props
}: Props) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      {...props}
      className={buttonVariants({
        variant,
        isLoading: loading,
        size,
        className,
      })}
    >
      {loading ? <Loader /> : children}
    </Component>
  );
}

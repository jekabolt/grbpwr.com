import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva("disabled:cursor-not-allowed", {
  variants: {
    variant: {
      default: ["text-textBaseSize"],
      simple: ["text-bgColor", "bg-textColor"],
      main: [
        "border",
        "border-textColor",
        "text-textBaseSize",
        "underline",
        "bg-textColor",
        "text-bgColor",
        "disabled:bg-textInactiveColor",
        "hover:bg-bgColor",
        "hover:text-textColor",
      ],
      underline: [
        "text-textBaseSize",
        "border-textColor",
        "underline",
        "disabled:text-textInactiveColor",
      ],
      underlineWithColors: [
        "underline",
        "text-textBaseSize",
        "text-highlightColor",
        "disabled:text-textInactiveColor",
        "visited:text-visitedLinkColor",
      ],
    },
    size: {
      sm: ["text-textSmallSize"],
      default: ["text-textBaseSize"],
      lg: ["py-2.5", "px-16", "text-textBaseSize"],
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
  loading,
  size,
  variant,
  className,
  ...props
}: Props) {
  const Component = asChild ? Slot : "button";

  return (
    <div>
      <Component
        {...props}
        className={buttonVariants({
          variant,
          size,
          className,
        })}
      >
        {children}
      </Component>
    </div>
  );
}

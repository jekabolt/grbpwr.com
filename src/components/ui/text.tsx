import { cva, VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {
    variant: {
      default: ["text-textColor"],
      inherit: ["text-inherit"],
      uppercase: ["text-textColor", "uppercase"],
      underlined: ["underline", "text-textColor"],
      strikethrough: ["line-through", "text-textColor"],
      strileTroughInactive: ["line-through", "text-textInactiveColor"],
      inactive: ["text-textInactiveColor"],
      undrleineWithColors: ["underline", "text-highlightColor"],
    },
    size: {
      default: ["text-textBaseSize"],
      giant: [
        "lg:text-textGiantSize",
        "text-textGiantSmallSize",
        "leading-tight",
        "lg:leading-tight",
        "whitespace-nowrap",
      ],
      small: ["text-textBaseSize"],
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

interface Props extends VariantProps<typeof textVariants> {
  children: React.ReactNode;
  className?: string;
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  [k: string]: unknown;
}

export function Text({
  size,
  children,
  className,
  variant,
  component = "p",
  ...props
}: Props) {
  const Component = component;
  return (
    <Component
      {...props}
      className={textVariants({ variant, size, className })}
    >
      {children}
    </Component>
  );
}

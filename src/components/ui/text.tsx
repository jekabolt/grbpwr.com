import { cva, VariantProps } from "class-variance-authority";

const textVariants = cva("text-textColor", {
  variants: {
    variant: {
      default: ["text-textColor"],
      uppercase: ["text-textColor", "uppercase"],
      underlined: ["underline", "text-textColor"],
      strikethrough: ["line-through", "text-textColor"],
      inactive: ["text-textInactiveColor"],
    },
    size: {
      default: ["text-textBaseSize"],
      giant: ["lg:text-textGiantSize", "text-textGiantSmallSize"],
      small: ["text-textSmallSize"],
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

import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

import { sendButtonEvent } from "@/lib/analitycs/button";

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
      simpleReverseWithBorder: [
        "text-textColor",
        "bg-bgColor",
        "border",
        "border-textColor",
        "leading-4",
      ],
      main: [
        "border",
        "border-textColor",
        "text-textBaseSize",
        "text-bgColor",
        "bg-textColor",
        "hover:bg-bgColor",
        "hover:text-textColor",
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
        "disabled:bg-textInactiveColor",
        "disabled:text-bgColor",
        "disabled:border-textInactiveColor",
        "leading-4",
        "text-center",
      ],
      underline: ["underline", "disabled:text-textInactiveColor"],
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
      strikeThrough: [
        "relative",
        "text-textBaseSize",
        "text-textInactiveColor",
        "before:absolute",
        "before:top-1/2",
        "before:left-0",
        "before:w-full",
        "before:h-[1px]",
        "before:-translate-y-1/2",
        "before:content-['']",
        "before:bg-[var(--inactive)]",
        "disabled:cursor-not-allowed",
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
  compoundVariants: [
    {
      variant: "main",
      isLoading: true,
    },
    {
      variant: "secondary",
      isLoading: true,
      className:
        "disabled:!bg-textColor disabled:!border-textColor disabled:!text-bgColor",
    },
  ],
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
  loadingType?: "default" | "order-processing" | "overlay";
  loadingReverse?: boolean;
  className?: string;
  /** When set, fires button_click analytics event on click */
  analyticsButtonId?: string;
  /** Optional product name for button_click context */
  analyticsProductName?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  [k: string]: unknown;
}

export function Button({
  asChild,
  children,
  loading = false,
  loadingType = "default",
  loadingReverse = false,
  size,
  variant,
  className,
  analyticsButtonId,
  analyticsProductName,
  onClick,
  ...props
}: Props) {
  const Component = asChild ? Slot : "button";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (analyticsButtonId) {
      sendButtonEvent({
        buttonId: analyticsButtonId,
        productName: analyticsProductName,
      });
    }
    onClick?.(e);
  };

  const renderContent = () => {
    if (!loading) return children;

    if (loadingType === "overlay") {
      return (
        <Loader type={loadingType} reverse={loadingReverse}>
          {children}
        </Loader>
      );
    }

    // For secondary and main variants with loading, use white loader on black background
    const shouldReverseLoader = variant === "secondary" || variant === "main";
    return <Loader type={loadingType} reverse={shouldReverseLoader} />;
  };

  const hasClickHandler = onClick !== undefined || analyticsButtonId;

  return (
    <Component
      {...props}
      {...(hasClickHandler && { onClick: handleClick })}
      className={buttonVariants({
        variant,
        isLoading: loading,
        size,
        className,
      })}
    >
      {renderContent()}
    </Component>
  );
}

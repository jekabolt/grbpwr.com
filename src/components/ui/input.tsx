import { cva } from "class-variance-authority";

export const variants = cva("w-full focus:outline-none focus:ring-0", {
  variants: {
    variant: {
      default: [
        "bg-bgColor",
        "border-b",
        "border-textColor",
        "text-textColor",
        "placeholder:text-textColor",
      ],
      secondary: [
        "bg-bgColor",
        "border-b",
        "border-textColor",
        "placeholder:text-textInactiveColor",
        "placeholder-shown:border-textInactiveColor",
      ],
    },
    size: {
      default: ["text-textBaseSize"],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface InputProps {
  type?: "email" | "number" | "tel" | "text";
  className?: string;
  name: string;
  [k: string]: any;
}

function Input({
  type = "text",
  className,
  name,
  ref,
  variant,
  ...props
}: InputProps) {
  return (
    <input
      id={name}
      type={type}
      ref={ref}
      className={variants({ variant, className })}
      {...props}
    />
  );
}

Input.displayName = "Input";

export default Input;

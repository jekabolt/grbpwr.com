import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { forwardRef } from "react";

export interface InputProps {
  type?: "email" | "number" | "tel" | "text";
  label?: string;
  name: string;
  errorMessage?: string;
  [k: string]: any;
}

export default forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", label, name, errorMessage, ...props },
  forwardedRef,
) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className={cn({
          hidden: !label,
        })}
      >
        {label}
      </Label>
      {errorMessage && <p className="text-errorColor">{errorMessage}</p>}
      <input
        id={name}
        type={type}
        ref={forwardedRef}
        className="w-full border-b border-textColor text-lg focus:border-b focus:border-textColor focus:outline-none"
        {...props}
      />
    </div>
  );
});

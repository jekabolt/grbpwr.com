import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps {
  className?: string;
  name: string;
  variant?: "default" | "secondary";
  [k: string]: any;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, name, variant = "default", ...props }, ref) => {
    return (
      <textarea
        id={name}
        ref={ref}
        className={cn(
          "mb-5 min-h-56 w-full resize-none appearance-none rounded-none bg-bgColor px-4 pt-2.5 text-textBaseSize focus:outline-none",
          {
            "border-textInactiveColor": variant === "secondary",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;

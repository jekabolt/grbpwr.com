import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useMask } from "@react-input/mask";
import { useRef } from "react";

export default function Input({
  type = "text",
  label,
  name,
  errorMessage,
  mask,
  ...props
}: {
  type?: "email" | "number" | "tel" | "text";
  label?: string;
  name: string;
  errorMessage?: string;
  mask?: string;
  [k: string]: any;
}) {
  const inputRef = mask
    ? useMask({ mask, replacement: { _: /\d/ } })
    : useRef<HTMLInputElement>(null);

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
        ref={inputRef}
        className="w-full border-b border-textColor text-lg focus:border-b focus:border-textColor focus:outline-none"
        {...props}
      />
    </div>
  );
}

import { cn } from "@/lib/utils";

export interface InputProps {
  type?: "email" | "number" | "tel" | "text";
  className?: string;
  name: string;
  placeholder?: string;
  [k: string]: any;
}

function Input({ type = "text", className, name, ...props }: InputProps) {
  return (
    <input
      id={name}
      type={type}
      name={name}
      className={cn(
        "w-full border-b border-textColor bg-bgColor text-lg placeholder:text-textInactiveColor placeholder-shown:border-textInactiveColor focus:border-textColor focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

Input.displayName = "Input";

export default Input;

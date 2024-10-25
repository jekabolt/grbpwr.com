export interface InputProps {
  type?: "email" | "number" | "tel" | "text";
  name: string;
  [k: string]: any;
}

function Input({ type = "text", name, ref, ...props }: InputProps) {
  return (
    <input
      id={name}
      type={type}
      ref={ref}
      className="w-full border-b border-textColor bg-bgColor text-lg focus:border-b focus:border-textColor focus:outline-none"
      {...props}
    />
  );
}

Input.displayName = "Input";

export default Input;

export default function Input({
  id,
  type = "text",
  label,
  name,
  errorMessage,
  ...props
}: {
  id: string;
  type?: "email" | "number" | "tel" | "text";
  label?: string;
  name: string;
  errorMessage?: string;
  [k: string]: any;
}) {
  return (
    <div>
      <label htmlFor={id} className={label ? undefined : "hidden"}>
        {label}:
      </label>
      {errorMessage && <p className="text-errorColor">{errorMessage}</p>}
      <input
        id={id}
        type={type}
        className="w-full border-b border-textColor text-lg focus:border-b focus:border-textColor focus:outline-none"
        {...props}
      />
    </div>
  );
}

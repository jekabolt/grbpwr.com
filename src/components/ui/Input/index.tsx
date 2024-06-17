import { InputStyle, getComponentByStyle } from "./styles";

export default function Input({
  id,
  type = "text",
  style = InputStyle.default,
  label,
  errorMessage,
  ...props
}: {
  id: string;
  type?: "email" | "number" | "tel" | "text";
  style?: InputStyle;
  label?: string;
  errorMessage?: string;
  [k: string]: any;
}) {
  const inputStyleClass = getComponentByStyle(style);

  return (
    <div>
      <label htmlFor={id} className={label ? "" : "hidden"}>
        {label}:
      </label>
      {errorMessage && <p className="text-red-700">{errorMessage}</p>}
      <input id={id} type={type} className={`${inputStyleClass}`} {...props} />
    </div>
  );
}

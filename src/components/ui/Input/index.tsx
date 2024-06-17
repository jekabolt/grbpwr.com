import { InputStyle, getComponentByStyle } from "./styles";

export default function Input({
  type = "text",
  style = InputStyle.default,
  label,
  disabled = false,
  readOnly = false,
  errorMessage,
  ...props
}: {
  type?: "email" | "number" | "tel" | "text";
  style?: InputStyle;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: string;
  [k: string]: any;
}) {
  const inputStyleClass = getComponentByStyle(style);

  return (
    <div>
      {label && <label>{label}:</label>}
      {errorMessage && <p className="text-red-700">{errorMessage}</p>}
      <input
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        className={`${inputStyleClass}`}
        {...props}
      />
    </div>
  );
}

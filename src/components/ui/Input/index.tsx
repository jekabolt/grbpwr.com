import { InputStyle, getInputStyleClass } from "./styles";

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
  const inputStyleClass = getInputStyleClass(style);

  return (
    <div>
      {label && <div>{label}:</div>}
      {errorMessage && <div className="text-red-700">{errorMessage}</div>}
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

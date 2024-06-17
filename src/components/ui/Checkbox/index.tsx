import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckboxStyle, getComponentByStyle } from "./styles";

export default function CheckboxGlobal({
  id,
  style = CheckboxStyle.default,
  label,
  name,
  ...props
}: {
  id: string;
  style?: CheckboxStyle;
  label: string;
  name: string;
  [k: string]: any;
}) {
  const inputStyleClass = getComponentByStyle(style);

  return (
    <div className="flex items-center">
      <Checkbox.Root
        className={`${inputStyleClass}`}
        id={id}
        name={name}
        {...props}
      >
        <Checkbox.Indicator className="h-full w-full bg-black"></Checkbox.Indicator>
      </Checkbox.Root>
      <label className="ml-3 leading-3" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

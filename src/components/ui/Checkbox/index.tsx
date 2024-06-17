import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckboxStyle, getComponentByStyle } from "./styles";

export default function CheckboxGlobal({
  id,
  style = CheckboxStyle.default,
  label,
  ...props
}: {
  id: string;
  style?: CheckboxStyle;
  label: string;
  [k: string]: any;
}) {
  const inputStyleClass = getComponentByStyle(style);

  return (
    <div className="flex items-center">
      <Checkbox.Root className={`${inputStyleClass}`} {...props} id={id}>
        <Checkbox.Indicator className="h-full w-full bg-black"></Checkbox.Indicator>
      </Checkbox.Root>
      <label className="pl-3 leading-none" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

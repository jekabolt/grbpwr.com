import { Label } from "@radix-ui/react-label";
import * as Checkbox from "@radix-ui/react-checkbox";

export default function CheckboxGlobal({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
  [k: string]: any;
}) {
  return (
    <div className="flex items-center gap-x-2">
      <Checkbox.Root
        className="flex h-3 w-3 appearance-none items-center justify-center border border-textColor"
        id={name}
        name={name}
        {...props}
      >
        <Checkbox.Indicator className="h-full w-full bg-textColor"></Checkbox.Indicator>
      </Checkbox.Root>
      <Label className="leading-3" htmlFor={name}>
        {label}
      </Label>
    </div>
  );
}

import { Label } from "@radix-ui/react-label";
import * as RadioGroup from "@radix-ui/react-radio-group";

export interface RadioGroupsProps {
  name: string;
  items: {
    label: string;
    value: string;
  }[];
  // todo: add disabled
  disabled?: boolean;
}

export default function RadioGroupComponent({ name, items }: RadioGroupsProps) {
  return (
    <RadioGroup.Root
      name={name}
      className="flex flex-col gap-2.5"
      aria-label="shipping method"
    >
      {items.map(({ value, label }) => (
        <div key={value} className="flex items-center gap-x-2">
          <RadioGroup.Item
            className="h-3 w-3 border border-textColor"
            value={value}
            id={`${value}-r`}
          >
            <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-3 after:w-3 after:bg-textColor after:content-['']" />
          </RadioGroup.Item>
          <Label
            className="text-xs leading-3 text-textColor"
            htmlFor={`${value}-r`}
          >
            {label}
          </Label>
        </div>
      ))}
    </RadioGroup.Root>
  );
}

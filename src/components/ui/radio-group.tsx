import { Label } from "@radix-ui/react-label";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { Text } from "./text";

export interface RadioGroupsProps {
  name: string;
  items: {
    label: string | React.ReactNode;
    value: string;
  }[];
  // todo: add disabled
  disabled?: boolean;
  [k: string]: any;
}

export default function RadioGroupComponent({
  name,
  items,
  ...props
}: RadioGroupsProps) {
  return (
    <RadioGroup.Root
      name={name}
      className="flex flex-col gap-3"
      aria-label="shipping method"
      {...props}
    >
      {items.map(({ value, label }) => (
        <div key={value} className="flex items-center gap-x-2">
          <RadioGroup.Item
            className="h-3 w-3 cursor-pointer rounded-full border border-textColor"
            value={value}
            id={`${value}-r`}
          >
            <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-textColor after:content-['']" />
          </RadioGroup.Item>
          <Label
            className="cursor-pointer text-xs leading-3 text-textColor"
            htmlFor={`${value}-r`}
          >
            <Text component="span">{label}</Text>
          </Label>
        </div>
      ))}
    </RadioGroup.Root>
  );
}

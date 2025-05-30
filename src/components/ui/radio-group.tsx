import { Label } from "@radix-ui/react-label";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

import { Text } from "./text";

export interface RadioGroupsProps {
  name: string;
  items: {
    label: string | React.ReactNode;
    value: string;
    icon?: React.ReactNode;
  }[];
  // todo: add disabled
  disabled?: boolean;
  [k: string]: any;
}

export default function RadioGroupComponent({
  name,
  items,
  icon,
  ...props
}: RadioGroupsProps) {
  return (
    <RadioGroup.Root
      name={name}
      className={cn("grid w-full grid-cols-2 gap-3", {
        "grid-cols-3": items.length === 3,
      })}
      aria-label="shipping method"
      {...props}
    >
      {items.map(({ value, label, icon }) => (
        <Label
          key={value}
          className={cn(
            "h-28 w-full cursor-pointer border border-textInactiveColor p-3",
            {
              "border-textColor": value === props.value,
            },
          )}
          htmlFor={`${value}-r`}
        >
          <div className="0 flex h-full flex-col justify-between">
            <div className="flex items-center gap-x-2">
              <RadioGroup.Item
                className="h-3 w-3 cursor-pointer rounded-full border border-textColor"
                value={value}
                id={`${value}-r`}
              >
                <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-textColor after:content-['']" />
              </RadioGroup.Item>

              <Text component="span">{label}</Text>
            </div>
            {icon && <div>{icon}</div>}
          </div>
        </Label>
      ))}
    </RadioGroup.Root>
  );
}

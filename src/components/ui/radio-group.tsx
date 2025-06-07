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
  view?: "card" | "default";
  disabled?: boolean;
  [k: string]: any;
}

export default function RadioGroupComponent({
  name,
  items,
  view = "default",
  ...props
}: RadioGroupsProps) {
  const isCardView = view === "card";
  const hasThreeItems = items.length === 3;
  const hasManyItems = items.length > 2;

  return (
    <RadioGroup.Root
      name={name}
      className="relative w-full overflow-x-hidden"
      aria-label="shipping method"
      {...props}
    >
      <div
        className={cn(
          "flex items-center gap-3 overflow-x-scroll lg:grid lg:grid-cols-2",
          {
            "lg:grid-cols-3": isCardView && hasThreeItems,
          },
        )}
      >
        {items.map(({ value, label, icon }) => {
          return (
            <Label
              key={value}
              className={cn("flex w-full cursor-pointer gap-3", {
                "h-28 border border-textInactiveColor p-3": isCardView,
                "w-40 min-w-40 flex-shrink-0 lg:w-full":
                  isCardView && hasManyItems,
                "border-textColor": value === props.value && isCardView,
              })}
              htmlFor={`${value}-r`}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start gap-x-2">
                  <RadioGroup.Item
                    className="h-3 w-3 cursor-pointer rounded-full border border-textColor"
                    value={value}
                    id={`${value}-r`}
                  >
                    <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-textColor after:content-['']" />
                  </RadioGroup.Item>
                  <Text className="leading-none">{label}</Text>
                </div>
                {icon && <div>{icon}</div>}
              </div>
            </Label>
          );
        })}
      </div>
    </RadioGroup.Root>
  );
}

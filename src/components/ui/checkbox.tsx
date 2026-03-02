import * as Checkbox from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export default function CheckboxGlobal({
  name,
  label,
  ...props
}: {
  name: string;
  label?: string;
  [k: string]: unknown;
}) {
  return (
    <div className="flex items-start gap-x-4 leading-none">
      <Checkbox.Root
        className={cn(
          "flex h-3 w-3 flex-none appearance-none items-center justify-center border border-textColor",
          {
            "border-textInactiveColor": props.disabled,
          },
        )}
        id={name}
        name={name}
        {...props}
      >
        <Checkbox.Indicator
          className={cn("h-full w-full bg-textColor", {
            "bg-textInactiveColor": props.disabled,
          })}
        />
      </Checkbox.Root>
      {label && (
        <Text
          component="label"
          variant="uppercase"
          htmlFor={name}
          className={cn("cursor-pointer", {
            "text-textInactiveColor": props.disabled,
          })}
        >
          {label}
        </Text>
      )}
    </div>
  );
}

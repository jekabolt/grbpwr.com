import { useId } from "react";
import { Label } from "@radix-ui/react-label";
import * as Switch from "@radix-ui/react-switch";

import { Text } from "./text";

export function ToggleSwitch({
  checked = false,
  label,
  disabled,
  onCheckedChange,
}: {
  checked?: boolean;
  label?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-5">
      <Switch.Root
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="relative mt-0.5 h-3 w-6 shrink-0 cursor-pointer border border-textColor bg-textColor before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] disabled:cursor-not-allowed data-[state=checked]:bg-bgColor"
      >
        <Switch.Thumb className="block h-2 w-2 translate-x-0.5 bg-bgColor data-[state=checked]:translate-x-3 data-[state=checked]:bg-textColor" />
      </Switch.Root>
      {label && (
        <Label htmlFor={id} className="min-w-0 flex-1">
          <Text variant="uppercase" className="break-words">
            {label}
          </Text>
        </Label>
      )}
    </div>
  );
}

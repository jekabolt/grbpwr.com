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
  return (
    <div className="flex items-center gap-5">
      <Switch.Root
        id="toggle"
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="relative h-3 w-6 cursor-pointer border border-textColor bg-textColor outline-none data-[state=checked]:bg-bgColor"
      >
        <Switch.Thumb className="block h-2 w-2 translate-x-0.5 bg-bgColor data-[state=checked]:translate-x-3 data-[state=checked]:bg-textColor" />
      </Switch.Root>
      {label && (
        <Label htmlFor="toggle">
          <Text variant="uppercase">{label}</Text>
        </Label>
      )}
    </div>
  );
}

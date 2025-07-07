import * as Checkbox from "@radix-ui/react-checkbox";

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
    <div className="flex items-start gap-x-4 lg:items-center">
      <Checkbox.Root
        className="flex h-3 w-3 flex-none appearance-none items-center justify-center border border-textColor"
        id={name}
        name={name}
        {...props}
      >
        <Checkbox.Indicator className="h-full w-full bg-textColor"></Checkbox.Indicator>
      </Checkbox.Root>
      {label && (
        <Text
          component="label"
          variant="uppercase"
          htmlFor={name}
          className="cursor-pointer leading-none"
        >
          {label}
        </Text>
      )}
    </div>
  );
}

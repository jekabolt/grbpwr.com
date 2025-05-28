import React from "react";
import * as Select from "@radix-ui/react-select";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export default function SelectComponent({
  name,
  items,
  className,
  renderValue,
  ...props
}: {
  name: string;
  items: { value: string; label: string }[];
  className?: string;
  renderValue?: (
    selectedValue: string,
    selectedItem: { label: string; value: string } | undefined,
  ) => React.ReactNode;
  [k: string]: any;
}) {
  return (
    <Select.Root {...props}>
      <SelectTrigger
        placeholder={props.placeholder}
        className={className}
        renderValue={renderValue}
        value={props.value}
        items={items}
      >
        {">"}
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select.Root>
  );
}

// todo: add type
export function SelectItem({ children, className, ref, ...props }: any) {
  return (
    <Select.Item
      className={cn(
        "relative flex h-6 select-none items-center px-2.5 leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-[rgba(0,0,0,0.08)] data-[highlighted]:text-textColor data-[disabled]:opacity-30 data-[highlighted]:outline-none",
        className,
      )}
      {...props}
      ref={ref}
    >
      <Select.ItemText>
        <Text variant="uppercase">{children}</Text>
      </Select.ItemText>
    </Select.Item>
  );
}

SelectItem.displayName = Select.Item.displayName;

export function SelectTrigger({
  children,
  placeholder,
  className,
  renderValue,
  value,
  items,
}: {
  children: React.ReactNode;
  placeholder: string;
  className?: string;
  renderValue?: (
    selectedValue: string,
    selectedItem: { label: string; value: string } | undefined,
  ) => React.ReactNode;
  value?: string;
  items?: { label: string; value: string }[];
}) {
  let displayValue = null;
  if (renderValue && value && items) {
    const selectedItem = items.find((item) => item.value === value);
    displayValue = renderValue(value, selectedItem);
  }

  return (
    <Select.Trigger
      className={cn(
        "inline-flex w-full items-center justify-between gap-2 border-b border-b-textColor bg-bgColor text-textBaseSize focus:outline-none focus:ring-0",
        className,
      )}
      aria-label={placeholder}
    >
      {displayValue ?? <Select.Value placeholder={placeholder} />}
      <Select.Icon className="text-textColor">{children}</Select.Icon>
    </Select.Trigger>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <Select.Portal>
      <Select.Content
        className="w-full overflow-hidden bg-bgColor shadow-md"
        position="popper"
      >
        <Select.Viewport className="max-h-[300px] bg-bgColor">
          {children}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
}

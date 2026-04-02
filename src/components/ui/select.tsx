import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/icons/arrow";
import { Text } from "@/components/ui/text";

export default function SelectComponent({
  name,
  items,
  className,
  customWidth,
  fullWidth,
  renderValue,
  ...props
}: {
  name: string;
  items: { value: string; label: string }[];
  className?: string;
  customWidth?: number;
  fullWidth?: boolean;
  renderValue?: (
    selectedValue: string,
    selectedItem: { label: string; value: string } | undefined,
  ) => React.ReactNode;
  [k: string]: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Select.Root {...props} open={open} onOpenChange={setOpen}>
      <SelectTrigger
        placeholder={props.placeholder}
        className={className}
        renderValue={renderValue}
        value={props.value}
        items={items}
        isOpen={open}
      >
        <Arrow
          className={cn("text-textColor", {
            "text-textInactiveColor": props.disabled,
          })}
        />
      </SelectTrigger>
      <SelectContent fullWidth={fullWidth} customWidth={customWidth}>
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
  value,
  items,
  isOpen,
  renderValue,
}: {
  children: React.ReactNode;
  placeholder: string;
  className?: string;
  value?: string;
  items?: { label: string; value: string }[];
  isOpen?: boolean;
  renderValue?: (
    selectedValue: string,
    selectedItem: { label: string; value: string } | undefined,
  ) => React.ReactNode;
}) {
  let displayValue = null;
  if (renderValue && value && items) {
    const selectedItem = items.find((item) => item.value === value);
    displayValue = renderValue(value, selectedItem);
  }

  return (
    <Select.Trigger
      className={cn(
        "flex w-full items-center justify-between gap-2 border-b border-textColor bg-bgColor text-textBaseSize focus:outline-none focus:ring-0 disabled:border-textInactiveColor disabled:text-textInactiveColor",
        className,
      )}
      aria-label={placeholder}
    >
      {displayValue ?? <Select.Value placeholder={placeholder} />}
      <Select.Icon
        className={cn("rotate-180 text-textColor", {
          "rotate-0": isOpen,
        })}
      >
        {children}
      </Select.Icon>
    </Select.Trigger>
  );
}

export function SelectContent({
  children,
  fullWidth,
  customWidth,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
  customWidth?: number;
}) {
  const getWidth = () => {
    if (fullWidth) return "var(--radix-select-trigger-width)";
    if (customWidth && customWidth > 0) return `${customWidth}px`;
    return undefined;
  };
  return (
    <Select.Portal>
      <Select.Content
        className="z-[100] w-full overflow-hidden border border-textInactiveColor bg-bgColor"
        position="popper"
        style={{
          width: getWidth(),
        }}
      >
        <Select.Viewport className="max-h-[300px] bg-bgColor">
          {children}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  );
}

import React from "react";
import * as Select from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

export default function SelectComponent({
  name,
  items,
  ...props
}: {
  name: string;
  items: { value: string; label: string }[];
  [k: string]: any;
}) {
  return (
    <Select.Root {...props}>
      <SelectTrigger placeholder={props.placeholder}>arrow down</SelectTrigger>
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
export function SelectItem ({ children, className, ref, ...props }: any) {
    return (
      <Select.Item
        className={cn(
          "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-textColor data-[disabled]:pointer-events-none data-[highlighted]:bg-textColor data-[highlighted]:text-textColor data-[disabled]:opacity-30 data-[highlighted]:outline-none",
          className,
        )}
        {...props}
        ref={ref}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          {/* <CheckIcon /> */}
          check icon
        </Select.ItemIndicator>
      </Select.Item>
    );
}

SelectItem.displayName = Select.Item.displayName;

export function SelectTrigger({
  children,
  placeholder,
}: {
  children: React.ReactNode;
  placeholder: string;
}) {
  return (
    <Select.Trigger
      className="inline-flex w-full items-center justify-between gap-2 border-b border-b-textColor bg-bgColor px-4 text-lg text-textColor data-[placeholder]:text-textColor"
      aria-label={placeholder}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon className="text-textColor">{children}</Select.Icon>
    </Select.Trigger>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <Select.Portal>
      {/* todo: fix width to be 100% of the container, same as trigger */}
      <Select.Content
        className="w-[500px] overflow-hidden bg-white shadow-md" // todo: fix bg-white to be bg-bgColor
        position="popper"
      >
        <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-bgColor text-textColor">
          arrow up
        </Select.ScrollUpButton>
        <Select.Viewport className="bg-bgColor p-[5px] ">
          {children}
        </Select.Viewport>
        <Select.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-bgColor text-textColor">
          arrow down
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  );
}

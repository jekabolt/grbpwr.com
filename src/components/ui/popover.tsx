"use client";

import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  openElement: React.ReactNode;
  title?: string;
  contentProps?: Popover.PopoverContentProps;
};
export default function GenericPopover({
  openElement,
  title,
  children,
  contentProps,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className={title && open ? "invisible relative" : ""}>
        {openElement}
      </Popover.Trigger>
      <PopoverContent title={title} {...contentProps}>
        {children}
      </PopoverContent>
    </Popover.Root>
  );
}

function PopoverContent({
  children,
  title,
  ...contentProps
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Popover.Portal>
      <Popover.Content
        side="bottom"
        align="center"
        className={cn("z-50 w-full bg-textColor px-2.5 py-6 text-bgColor", {
          "border border-white pt-0": title,
        })}
        {...contentProps}
      >
        {title && (
          <Popover.Close className="mb-4 flex w-full justify-between">
            <span>{title}</span>
            <span aria-label="Close">
              {/* todo: change to icon */}
              {"["}X{"]"}
            </span>
          </Popover.Close>
        )}
        {children}
      </Popover.Content>
    </Popover.Portal>
  );
}

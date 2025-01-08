"use client";

import React from "react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

import { Text } from "./text";

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
  return (
    <Popover.Root>
      <Popover.Trigger>{openElement}</Popover.Trigger>
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
        className={cn(
          "relative z-50 w-full bg-textColor px-2.5 py-6 text-bgColor",
          {
            "max-h-[50vh] overflow-y-scroll border border-white p-2": title,
          },
        )}
        {...contentProps}
      >
        {title && (
          <Popover.Close className="fixed left-0 top-0 flex w-full justify-between border-l border-r border-t border-white bg-black p-2.5">
            <Text variant="uppercase" component="span" className="text-white">
              {title}
            </Text>
            <span aria-label="Close">
              {/* todo: change to icon */}
              {"["}X{"]"}
            </span>
          </Popover.Close>
        )}
        <div className="mt-10">{children}</div>
      </Popover.Content>
    </Popover.Portal>
  );
}

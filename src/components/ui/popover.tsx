"use client";

import React from "react";
import * as Popover from "@radix-ui/react-popover";

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
        side="top"
        align="center"
        className="bg-textColor px-2.5 py-6 text-bgColor"
        {...contentProps}
      >
        {title && (
          <div className="mb-4 flex justify-between">
            <span className="block">{title}</span>
            <Popover.Close aria-label="Close">
              {/* todo: change to icon */}
              {"["}X{"]"}
            </Popover.Close>
          </div>
        )}
        {children}
      </Popover.Content>
    </Popover.Portal>
  );
}

"use client";

import React from "react";
import * as Popover from "@radix-ui/react-popover";

export default function GenericPopover({
  openText,
  openElement,
  title,
  children,
  contentProps,
}: {
  children: React.ReactNode;
  openElement?: React.ReactNode;
  title: string;
  openText?: string;
  contentProps?: any;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        {openElement || (
          <span className="bg-textColor px-2 py-1 text-buttonTextColor">
            {openText}
          </span>
        )}
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
  title: string;
}) {
  console.log(contentProps);
  return (
    <Popover.Portal>
      <Popover.Content
        side="top"
        align="center"
        // {/* todo: change to correct theme collor */}
        className="bg-black p-3 text-white"
        {...contentProps}
      >
        <div className="mb-4 flex justify-between">
          <span className="block">{title}</span>
          <Popover.Close aria-label="Close">
            {/* todo: change to icon */}
            {"["}X{"]"}
          </Popover.Close>
        </div>
        {children}
      </Popover.Content>
    </Popover.Portal>
  );
}

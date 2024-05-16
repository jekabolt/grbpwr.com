"use client";

import React from "react";
import * as Popover from "@radix-ui/react-popover";

export default function GenericPopover({
  // pass another children for more complex cases
  // add contentProps if position need to be customized
  openText,
  title,
  children,
}: {
  children: React.ReactNode;
  title: string;
  openText: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <span className="bg-textColor px-2 py-1 text-buttonTextColor">
          {openText}
        </span>
      </Popover.Trigger>
      <PopoverContent title={title}>{children}</PopoverContent>
    </Popover.Root>
  );
}

function PopoverContent({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Popover.Portal>
      <Popover.Content
        side="top"
        align="center"
        // {/* todo: change to correct theme collor */}
        className="bg-black p-3 text-white"
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

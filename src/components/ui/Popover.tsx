"use client";

import React from "react";
import * as Popover from "@radix-ui/react-popover";

const PopoverDemo = () => (
  <Popover.Root>
    <Popover.Trigger>
      {/* <MixerHorizontalIcon /> */}
      open
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content sideOffset={-16} side="top" align="center">
        {/* todo: change to correct theme collor */}
        <div className="h-[200px] w-40 bg-black">
          {/* todo: change to correct theme collor */}
          <Popover.Close aria-label="Close" className="text-white">
            X
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export default PopoverDemo;

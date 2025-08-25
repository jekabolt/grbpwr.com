"use client";

import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

import { Text } from "./text";

type Props = {
  children: React.ReactNode;
  openElement: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  title?: string;
  contentProps?: Popover.PopoverContentProps;
  className?: string;
  gap?: "default" | "large";
};

export default function GenericPopover({
  openElement,
  title,
  children,
  contentProps,
  className,
  gap = "default",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger className="flex items-center">
        {typeof openElement === "function" ? openElement(isOpen) : openElement}
      </Popover.Trigger>
      <PopoverContent
        className={className}
        title={title}
        gap={gap}
        {...contentProps}
      >
        {children}
      </PopoverContent>
    </Popover.Root>
  );
}

function PopoverContent({
  children,
  title,
  className,
  gap = "default",
  ...contentProps
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  gap?: "default" | "large";
}) {
  return (
    <Popover.Portal>
      <Popover.Content
        side="bottom"
        align="center"
        className={cn(
          "relative z-20 w-full space-y-10 border border-textInactiveColor bg-bgColor px-2.5",
          {
            "space-y-16": gap === "large",
          },
          className,
        )}
        {...contentProps}
      >
        {title && (
          <Popover.Close
            className={cn(
              "fixed left-2 right-2 top-2.5 bg-bgColor",
              "appearance-none border-0 outline-none focus:outline-none",
            )}
          >
            <div className="flex items-center justify-between">
              <Text variant="uppercase">{title}</Text>
              <Text>[x]</Text>
            </div>
          </Popover.Close>
        )}
        <div className="relative max-h-[50vh] overflow-y-scroll">
          <div className="sticky top-0">{children}</div>
        </div>
      </Popover.Content>
    </Popover.Portal>
  );
}

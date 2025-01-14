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
  className?: string;
  variant?: "default" | "currency";
};

export default function GenericPopover({
  openElement,
  title,
  children,
  contentProps,
  className,
  variant = "default",
}: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger>{openElement}</Popover.Trigger>
      <PopoverContent
        className={className}
        title={title}
        variant={variant}
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
  variant = "default",
  ...contentProps
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: "default" | "currency";
}) {
  return (
    <Popover.Portal>
      <Popover.Content
        side="bottom"
        align="center"
        className={cn(
          "blackTheme relative z-50 w-full bg-bgColor px-2 py-6 text-textColor",
          {
            "max-h-[50vh] overflow-y-scroll p-2": title,
          },
          className,
        )}
        {...contentProps}
      >
        {title && (
          <Popover.Close
            className={cn(
              "blackTheme fixed left-0 top-0 flex w-full justify-between bg-bgColor p-2 text-textColor",
              {
                "border-l border-r border-t border-white":
                  variant === "currency",
              },
            )}
          >
            <Text variant="uppercase" component="span">
              {title}
            </Text>
            <span aria-label="Close">
              {"["}X{"]"}
            </span>
          </Popover.Close>
        )}
        <div className="mt-10">{children}</div>
      </Popover.Content>
    </Popover.Portal>
  );
}

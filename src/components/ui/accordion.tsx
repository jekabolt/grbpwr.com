"use client";

import { forwardRef, type ReactNode } from "react";
import * as AccordionPrimitives from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { MinusIcon } from "./icons/minus";
import { PlusIcon } from "./icons/plus";

type PreviewTitleProps = {
  text: string;
  maxLines?: number;
  className?: string;
};

function PreviewTitle({ text, maxLines = 4, className }: PreviewTitleProps) {
  return (
    <Text
      className={cn(
        `line-clamp-${maxLines} overflow-hidden text-ellipsis`,
        className,
      )}
      style={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: maxLines,
        lineClamp: maxLines,
      }}
    >
      {text}
    </Text>
  );
}

export const AccordionItem = forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitives.Item
      className={cn("w-full", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </AccordionPrimitives.Item>
  ),
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitives.Header>
      <AccordionPrimitives.Trigger
        className={cn(
          "group flex w-full cursor-pointer items-end justify-between gap-2.5 outline-none",
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}

        <div className="p-1">
          <Text className="block group-data-[state=closed]:hidden">
            <MinusIcon />
          </Text>
          <Text className="hidden group-data-[state=closed]:block">
            <PlusIcon />
          </Text>
        </div>
      </AccordionPrimitives.Trigger>
    </AccordionPrimitives.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitives.Content {...props} ref={forwardedRef}>
      <Text>{children}</Text>
    </AccordionPrimitives.Content>
  ),
);
AccordionContent.displayName = "AccordionContent";

export const AccordionRoot = AccordionPrimitives.Root;

type AccordionSectionProps = {
  value: string;
  previewText?: string;
  children: ReactNode;
  maxPreviewLines?: number;
  currentValue?: string;
};

export function AccordionSection({
  value,
  previewText,
  children,
  maxPreviewLines = 4,
  currentValue,
}: AccordionSectionProps) {
  const isOpen = currentValue === value;

  return (
    <AccordionItem
      value={value}
      className="flex items-end justify-between gap-x-2.5"
    >
      <AccordionContent>{children}</AccordionContent>
      <AccordionTrigger>
        {previewText && !isOpen && (
          <PreviewTitle
            text={previewText || ""}
            maxLines={maxPreviewLines}
            className="text-left uppercase"
          />
        )}
      </AccordionTrigger>
    </AccordionItem>
  );
}

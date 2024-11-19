"use client";

import { forwardRef } from "react";
import * as AccordionPrimitives from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

export const AccordionItem = forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitives.Item
      className={cn(
        "mt-px w-full overflow-hidden first:mt-0 focus-within:relative focus-within:z-10",
        className,
      )}
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
    <AccordionPrimitives.Header className="flex">
      <AccordionPrimitives.Trigger
        className={cn(
          "group flex flex-1 cursor-default items-center gap-5 outline-none",
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <span className="transition-transform duration-150 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-45">
          +
        </span>
      </AccordionPrimitives.Trigger>
    </AccordionPrimitives.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<any, any>(
  ({ children, className, ...props }, forwardedRef) => (
    <AccordionPrimitives.Content
      className={cn("overflow-hidden", className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="">{children}</div>
    </AccordionPrimitives.Content>
  ),
);
AccordionContent.displayName = "AccordionContent";

export const AccordionRoot = AccordionPrimitives.Root;

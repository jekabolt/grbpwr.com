"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import CustomCursor from "./custom-cursor";
import { Text } from "./text";

export default function Modal({
  title,
  children,
  openElement,
  customCursor = false,
}: {
  title?: string;
  children: React.ReactNode;
  openElement: string;
  customCursor?: boolean;
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Button
        variant="underline"
        className="uppercase"
        onClick={() => setModalOpen(!isModalOpen)}
      >
        {openElement}
      </Button>
      {isModalOpen && (
        <div
          className={cn(
            "absolute inset-0 z-50 flex h-full w-full flex-col gap-2 bg-bgColor",
            {
              "cursor-none": customCursor,
            },
          )}
        >
          {customCursor && <CustomCursor />}
          <div className="flex items-center justify-between">
            <Text variant="uppercase">{title}</Text>
            <Button
              className={cn("", {
                hidden: customCursor,
              })}
              onClick={() => setModalOpen(!isModalOpen)}
            >
              [x]
            </Button>
          </div>
          <div onClick={() => setModalOpen(!isModalOpen)} className="h-full">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Text } from "./text";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider duration={4000}>
      {children}
      <Toast.Viewport className="not-prose fixed inset-x-2 top-2 z-[60] lg:top-2" />
    </Toast.Provider>
  );
}

export function EmailToaster({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: "email";
}) {
  const [open, setOpen] = useState(false);
  const isEmail = title === "email";
  const tToaster = useTranslations("toaster");
  return (
    <>
      <Button
        className={cn("outline-none", className)}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <Toast.Root
        className="flex h-12 cursor-pointer items-center justify-center bg-highlightColor lg:h-8"
        open={open}
        onOpenChange={setOpen}
        onClick={() => setOpen(false)}
      >
        <Toast.Title>
          <Text className="lowercase text-bgColor">
            {isEmail && tToaster("email_copied")}
          </Text>
        </Toast.Title>
      </Toast.Root>
    </>
  );
}

export function SubmissionToaster({
  open,
  message,
  duration,
  onOpenChange,
  intent = "success",
}: {
  open: boolean;
  message?: string;
  duration?: number;
  onOpenChange: (open: boolean) => void;
  intent?: "success" | "error";
}) {
  const persistUntilClosed = duration === Infinity;
  const isError = intent === "error";
  return (
    <Toast.Root
      className={cn(
        "flex h-12 cursor-pointer items-center justify-center lg:h-8",
        // Errors paint the reserved Error token (red fill, ink text); the default
        // success intent keeps the highlight accent. Ink on #ff0000 ≈ 5.25:1 (AA).
        isError ? "bg-errorColor" : "bg-highlightColor",
        persistUntilClosed &&
          "justify-between px-2.5 lg:relative lg:justify-center",
      )}
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      onClick={() => onOpenChange(false)}
    >
      <Toast.Title>
        <Text
          className={cn(
            "text-center lowercase",
            isError ? "text-textColor" : "text-bgColor",
          )}
        >
          {message}
        </Text>
      </Toast.Title>
      {persistUntilClosed && (
        <Toast.Close asChild>
          <Button
            className="text-bgColor lg:absolute lg:right-2 lg:top-1/2 lg:shrink-0 lg:-translate-y-1/2"
            aria-label="Close"
          >
            [x]
          </Button>
        </Toast.Close>
      )}
    </Toast.Root>
  );
}

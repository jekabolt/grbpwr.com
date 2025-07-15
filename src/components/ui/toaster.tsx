"use client";

import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";

import { Button } from "./button";
import { Text } from "./text";

// Global Toast Provider - add this to your app root
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider duration={4000}>
      {children}
      <Toast.Viewport className="not-prose fixed inset-x-2.5 top-2.5 z-50 lg:top-14" />
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

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Toast.Root
        className="flex h-8 items-center justify-center bg-highlightColor"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title>
          <Text className="text-bgColor">{isEmail && "e-mail copied"}</Text>
        </Toast.Title>
      </Toast.Root>
    </>
  );
}

export function SubmissionToaster({
  open,
  onOpenChange,
  message,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: "submission";
  message?: string;
}) {
  return (
    <Toast.Root
      className="flex h-8 items-center justify-center bg-highlightColor"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Toast.Title>
        <Text className="text-center text-bgColor">
          {title === "submission" && message}
        </Text>
      </Toast.Title>
    </Toast.Root>
  );
}

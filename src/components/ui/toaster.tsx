"use client";

import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { useTranslations } from "next-intl";

import { Button } from "./button";
import { Text } from "./text";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider duration={4000}>
      {children}
      <Toast.Viewport className="not-prose fixed inset-x-2.5 top-2 z-50 lg:top-2" />
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
      <Button className={className} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Toast.Root
        className="flex h-12 items-center justify-center bg-highlightColor lg:h-8"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title>
          <Text className="text-bgColor">
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
  onOpenChange,
}: {
  open: boolean;
  message?: string;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Toast.Root
      className="flex h-8 items-center justify-center bg-highlightColor"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Toast.Title>
        <Text className="text-center text-bgColor">{message}</Text>
      </Toast.Title>
    </Toast.Root>
  );
}

"use client";

import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";

import { Button } from "./button";
import { Text } from "./text";

export function Toaster({
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
    <Toast.Provider duration={3000}>
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
      <Toast.Viewport className="fixed left-2.5 right-2.5 top-14 z-50" />
    </Toast.Provider>
  );
}

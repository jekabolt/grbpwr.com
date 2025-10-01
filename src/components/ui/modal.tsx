"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "./button";
import { Text } from "./text";

export function Modal({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Button onClick={toggleModal}>{title}</Button>
      {isOpen &&
        createPortal(
          <div className="blackTheme fixed inset-y-0 right-0 z-50 h-screen w-[450px] bg-bgColor p-2.5 text-textColor">
            <div>
              <Text variant="uppercase">{title}</Text>
              <Button onClick={toggleModal}>[x]</Button>
            </div>
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}

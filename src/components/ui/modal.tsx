"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import CustomCursor from "./custom-cursor";
import { Text } from "./text";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  openElement: string;
  customCursor?: boolean;
  shouldRender?: boolean;
}

export default function Modal({
  title,
  children,
  openElement,
  customCursor = false,
  shouldRender = true,
}: ModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  if (!shouldRender) return null;

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <div>
      <Button variant="underline" className="uppercase" onClick={toggleModal}>
        {openElement}
      </Button>
      {isModalOpen && (
        <div
          ref={modalRef}
          onClick={toggleModal}
          className={cn(
            "absolute inset-0 z-50 flex h-full w-full flex-col gap-5 bg-bgColor",
            {
              "cursor-none": customCursor,
            },
          )}
        >
          {customCursor && <CustomCursor containerRef={modalRef} />}
          {title && (
            <div className="flex items-center justify-between">
              <Text variant="uppercase">{title}</Text>
              <Button
                className={cn("", {
                  hidden: customCursor,
                })}
                onClick={toggleModal}
              >
                [x]
              </Button>
            </div>
          )}
          <div className="h-full">{children}</div>
        </div>
      )}
    </div>
  );
}

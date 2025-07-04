"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/icons/arrow";
import { Text } from "@/components/ui/text";

export default function FieldsGroupContainer({
  stage,
  title,
  children,
  summary,
  isOpen = false,
  disabled = false,
  onToggle,
}: {
  stage: string;
  title: string;
  summary?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
}) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  function handleToggle() {
    if (disabled) return;
    setLocalIsOpen((v) => !v);
    onToggle?.();
  }

  return (
    <div className="space-y-8">
      <div
        className={cn("flex cursor-pointer items-center justify-between", {
          "opacity-50": disabled,
        })}
        onClick={handleToggle}
      >
        <div className="flex gap-x-6">
          <Text variant={disabled ? "inactive" : "uppercase"} className="w-8">
            {stage}
          </Text>
          <Text variant={disabled ? "inactive" : "uppercase"} component="h2">
            {title}
          </Text>
        </div>

        <div
          className={cn("rotate-180 text-textColor", {
            "rotate-0": localIsOpen,
          })}
        >
          <Arrow />
        </div>
      </div>
      <div className={cn("space-y-8", { hidden: !localIsOpen })}>
        {children}
      </div>
      {!localIsOpen && <div className="space-y-8">{summary}</div>}
    </div>
  );
}

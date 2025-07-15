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
  clickableArea = "default",
  mode = "collapsible",

  onToggle,
}: {
  stage: string;
  title: string;
  summary?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  clickableArea?: "full" | "default";
  mode?: "collapsible" | "non-collapsible";
  onToggle?: () => void;
}) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  function handleToggle() {
    if (disabled || mode === "non-collapsible") return;
    setLocalIsOpen((v) => !v);
    onToggle?.();
  }

  return (
    <div
      className={cn("space-y-4 lg:space-y-8", {
        "space-y-0 lg:space-y-0": clickableArea === "full",
      })}
    >
      <div
        className={cn("flex items-center justify-between", {
          "h-20": clickableArea === "full",
          "opacity-50": disabled,
          "cursor-pointer": mode === "collapsible" && !disabled,
        })}
        onClick={mode === "collapsible" ? handleToggle : undefined}
      >
        <div className="flex gap-x-6">
          {stage && (
            <Text variant={disabled ? "inactive" : "uppercase"} className="w-8">
              {stage}
            </Text>
          )}
          <Text variant={disabled ? "inactive" : "uppercase"} component="h2">
            {title}
          </Text>
        </div>

        {mode === "collapsible" && (
          <div
            className={cn("rotate-180 text-textColor", {
              "rotate-0": localIsOpen,
            })}
          >
            <Arrow />
          </div>
        )}
      </div>
      <div
        className={cn("h-full space-y-8", {
          hidden: mode === "collapsible" && !localIsOpen,
          "ml-14": mode === "non-collapsible" && stage,
        })}
      >
        {children}
      </div>
      {mode === "collapsible" && !localIsOpen && (
        <div className="space-y-8">{summary}</div>
      )}
    </div>
  );
}

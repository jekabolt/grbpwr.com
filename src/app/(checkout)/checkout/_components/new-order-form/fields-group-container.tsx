"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/icons/arrow";
import { Text } from "@/components/ui/text";

interface FieldsGroupContainerProps {
  stage?: string;
  title: string;
  summary?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  mode?: "collapsible" | "non-collapsible";
  styling?: {
    clickableArea?: "full" | "default";
    clickableAreaClassName?: string;
    childrenSpacing?: string;
  };
  onToggle?: () => void;
}

export default function FieldsGroupContainer({
  stage,
  title,
  children,
  summary,
  isOpen = false,
  disabled = false,
  mode = "collapsible",
  styling = {},
  onToggle,
}: FieldsGroupContainerProps) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  const {
    clickableArea = "default",
    clickableAreaClassName,
    childrenSpacing = "space-y-8",
  } = styling;

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
        "space-y-4": mode === "non-collapsible",
      })}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          {
            "h-20": clickableArea === "full" && !clickableAreaClassName,
            "opacity-50": disabled,
            "cursor-pointer": mode === "collapsible" && !disabled,
          },
          clickableArea === "full" ? clickableAreaClassName : undefined,
        )}
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
        className={cn("h-full", childrenSpacing, {
          hidden: mode === "collapsible" && !localIsOpen,
          "lg:ml-14": mode === "non-collapsible" && stage,
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

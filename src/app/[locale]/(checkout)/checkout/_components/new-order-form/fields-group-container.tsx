"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/icons/arrow";
import { MinusIcon } from "@/components/ui/icons/minus";
import { PlusIcon } from "@/components/ui/icons/plus";
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
    sign?: "arrow" | "plus-minus";
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
    sign = "arrow",
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
      className={cn("space-y-4 bg-bgColor text-textColor lg:space-y-8", {
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
            <Text variant="uppercase" className="w-8 text-textColor">
              {stage}
            </Text>
          )}
          <Text variant="uppercase" className="text-textColor" component="h2">
            {title}
          </Text>
        </div>

        {mode === "collapsible" && sign === "arrow" ? (
          <div
            className={cn("rotate-180 text-textColor", {
              "rotate-0": localIsOpen,
            })}
          >
            <Arrow className="text-textColor" />
          </div>
        ) : (
          <div className="text-textColor">
            {localIsOpen ? <MinusIcon /> : <PlusIcon />}
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
        <div
          className={cn("space-y-8", {
            "opacity-50": disabled,
          })}
        >
          {summary}
        </div>
      )}
    </div>
  );
}

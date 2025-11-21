"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/icons/arrow";
import { MinusIcon } from "@/components/ui/icons/minus";
import { PlusIcon } from "@/components/ui/icons/plus";
import { Text } from "@/components/ui/text";

interface CollapsibleSignProps {
  sign: "arrow" | "plus-minus";
  isOpen: boolean;
  position: "before" | "after";
}

interface FieldsGroupContainerProps {
  stage?: string;
  title: string;
  preview?: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  mode?: "collapsible" | "non-collapsible";
  className?: string;
  styling?: {
    clickableArea?: "full" | "default";
    clickableAreaClassName?: string;
    childrenSpacing?: string;
    sign?: "arrow" | "plus-minus";
    signPosition?: "before" | "after";
  };
  onToggle?: () => void;
}

export default function FieldsGroupContainer({
  stage,
  title,
  preview,
  children,
  summary,
  isOpen = false,
  disabled = false,
  mode = "collapsible",
  className,
  styling = {},
  onToggle,
}: FieldsGroupContainerProps) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  const {
    clickableArea = "default",
    clickableAreaClassName,
    childrenSpacing = "space-y-8",
    sign = "arrow",
    signPosition = "after",
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
          "flex items-center",
          {
            "justify-between": mode === "collapsible",
            "h-20": clickableArea === "full" && !clickableAreaClassName,
            "opacity-50": disabled,
            "cursor-pointer": mode === "collapsible" && !disabled,
          },
          clickableArea === "full" ? clickableAreaClassName : undefined,
          className,
        )}
        onClick={mode === "collapsible" ? handleToggle : undefined}
      >
        <div
          className={cn("flex flex-1 gap-x-6", {
            "items-center": !preview,
            "items-start": preview,
          })}
        >
          {stage && (
            <Text variant="uppercase" className="w-8 text-textColor">
              {stage}
            </Text>
          )}
          <div className="flex flex-1 items-start justify-between">
            <div className="flex items-center">
              {mode === "collapsible" && signPosition === "before" && (
                <CollapsibleSign
                  sign={sign}
                  isOpen={localIsOpen}
                  position={signPosition}
                />
              )}
              <Text
                variant="uppercase"
                className="text-textColor"
                component="h2"
              >
                {title}
              </Text>
            </div>
            {preview && <div>{preview}</div>}
          </div>
        </div>

        {mode === "collapsible" && signPosition === "after" && (
          <CollapsibleSign
            sign={sign}
            isOpen={localIsOpen}
            position={signPosition}
          />
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

function CollapsibleSign({ sign, isOpen, position }: CollapsibleSignProps) {
  const signContent =
    sign === "arrow" ? (
      <div
        className={cn("rotate-180", {
          "rotate-0": isOpen,
        })}
      >
        <Arrow className="text-textColor" />
      </div>
    ) : (
      <>{isOpen ? <MinusIcon /> : <PlusIcon />}</>
    );

  return (
    <div
      className={cn("text-textColor", {
        "mr-6": position === "before" && sign === "arrow",
        "mr-4": position === "before" && sign === "plus-minus",
      })}
    >
      {signContent}
    </div>
  );
}

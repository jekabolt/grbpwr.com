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
  preview?: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean; // controlled open state
  disabled?: boolean;
  collapsible?: boolean; // instead of mode
  className?: string;
  onToggle?: () => void;
  signType?: "arrow" | "plus-minus"; // simplified sign props
  signPosition?: "before" | "after";
  clickableAreaClassName?: string; // optional to extend control
  childrenSpacingClass?: string; // spacing customization
  titleWrapperClassName?: string;
}

export default function FieldsGroupContainer({
  stage,
  title,
  preview,
  summary,
  children,
  isOpen = false,
  disabled = false,
  collapsible = true,
  className,
  onToggle,
  signType = "arrow",
  signPosition = "after",
  clickableAreaClassName,
  childrenSpacingClass = "space-y-8",
  titleWrapperClassName,
}: FieldsGroupContainerProps) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled || !collapsible) return;
    setLocalIsOpen((v) => !v);
    onToggle?.();
  };

  return (
    <div
      className={cn(
        "space-y-4 bg-bgColor text-textColor lg:space-y-8",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          { "h-20 cursor-pointer opacity-50": disabled },
          { "cursor-pointer": collapsible && !disabled },
          clickableAreaClassName,
        )}
        onClick={collapsible ? handleToggle : undefined}
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

          <div
            className={cn(
              "flex flex-1 items-start justify-between",
              titleWrapperClassName,
            )}
          >
            <div className="flex items-center">
              {collapsible && signPosition === "before" && (
                <CollapsibleSign
                  sign={signType}
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

        {collapsible && signPosition === "after" && (
          <CollapsibleSign
            sign={signType}
            isOpen={localIsOpen}
            position={signPosition}
          />
        )}
      </div>

      <div
        className={cn(childrenSpacingClass, {
          hidden: collapsible && !localIsOpen,
          "lg:ml-14": !collapsible && !!stage,
        })}
      >
        {children}
      </div>

      {collapsible && !localIsOpen && (
        <div className={cn("space-y-8", { "opacity-50": disabled })}>
          {summary}
        </div>
      )}
    </div>
  );
}

function CollapsibleSign({
  sign,
  isOpen,
  position,
}: {
  sign: "arrow" | "plus-minus";
  isOpen: boolean;
  position: "before" | "after";
}) {
  const signContent =
    sign === "arrow" ? (
      <div
        className={cn("transition-transform", {
          "rotate-0": isOpen,
          "rotate-180": !isOpen,
        })}
      >
        <Arrow className="text-textColor" />
      </div>
    ) : isOpen ? (
      <MinusIcon />
    ) : (
      <PlusIcon />
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

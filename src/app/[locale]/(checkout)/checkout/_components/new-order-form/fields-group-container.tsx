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
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  collapsible?: boolean;
  className?: string;
  signType?: "arrow" | "plus-minus";
  signPosition?: "before" | "after";
  clickableAreaClassName?: string;
  childrenSpacingClass?: string;
  titleWrapperClassName?: string;
  onToggle?: () => void;
}

export default function FieldsGroupContainer({
  stage,
  title,
  preview,
  children,
  isOpen = false,
  disabled = false,
  collapsible = true,
  className,
  signType = "arrow",
  signPosition = "after",
  clickableAreaClassName,
  childrenSpacingClass = "space-y-8",
  titleWrapperClassName,
  onToggle,
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
          { "h-20 cursor-pointer": disabled },
          { "cursor-pointer": collapsible && !disabled },
          clickableAreaClassName,
        )}
        onClick={collapsible ? handleToggle : undefined}
      >
        <div className="flex flex-1 items-center gap-x-6">
          {stage && (
            <Text
              variant="uppercase"
              className={cn("w-8 text-textColor", {
                "text-textInactiveColor": disabled,
              })}
            >
              {stage}
            </Text>
          )}

          <div
            className={cn(
              "flex flex-1 items-center justify-between",
              titleWrapperClassName,
            )}
          >
            <div className="flex items-center">
              {collapsible && signPosition === "before" && (
                <CollapsibleSign
                  sign={signType}
                  isOpen={localIsOpen}
                  position={signPosition}
                  disabled={disabled}
                />
              )}
              <Text
                variant="uppercase"
                className={cn("text-textColor", {
                  "text-textInactiveColor": disabled,
                })}
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
            disabled={disabled}
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
    </div>
  );
}

function CollapsibleSign({
  sign,
  isOpen,
  position,
  disabled,
}: {
  sign: "arrow" | "plus-minus";
  isOpen: boolean;
  position: "before" | "after";
  disabled?: boolean;
}) {
  const signContent =
    sign === "arrow" ? (
      <div
        className={cn("transition-transform", {
          "rotate-0": isOpen,
          "rotate-180": !isOpen,
        })}
      >
        <Arrow
          className={cn("text-textColor", {
            "text-textInactiveColor": disabled,
          })}
        />
      </div>
    ) : isOpen ? (
      <MinusIcon
        className={cn("text-textColor", { "text-textInactiveColor": disabled })}
      />
    ) : (
      <PlusIcon
        className={cn("text-textColor", { "text-textInactiveColor": disabled })}
      />
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

"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/icons/arrow";
import { LockIcon } from "@/components/ui/icons/lock";
import { MinusIcon } from "@/components/ui/icons/minus";
import { PlusIcon } from "@/components/ui/icons/plus";
import { Text } from "@/components/ui/text";

interface FieldsGroupContainerProps {
  stage?: string;
  title: string;
  preview?: React.ReactNode;
  /** Reason shown in the header when the group is gated (disabled), e.g.
   * "complete contact to continue". Only rendered while `disabled` is true. */
  disabledHint?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  collapsible?: boolean;
  className?: string;
  signType?: "arrow" | "plus-minus";
  signPosition?: "before" | "after";
  clickableAreaClassName?: string;
  childrenSpacingClass?: string;
  headerContentGapClass?: string;
  titleWrapperClassName?: string;
  titleClassName?: string;
  onToggle?: () => void;
  childrenOffset?: "title" | "stage";
}

export default function FieldsGroupContainer({
  stage,
  title,
  preview,
  disabledHint,
  children,
  isOpen = false,
  disabled = false,
  collapsible = true,
  className,
  signType = "arrow",
  signPosition = "after",
  clickableAreaClassName,
  childrenSpacingClass = "space-y-8",
  headerContentGapClass = "space-y-4 lg:space-y-8",
  titleWrapperClassName,
  titleClassName,
  onToggle,
  childrenOffset = "title",
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

  const gated = disabled && Boolean(disabledHint);

  return (
    <div
      className={cn(
        "bg-bgColor text-textColor",
        headerContentGapClass,
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 items-center justify-between",
          { "h-auto cursor-pointer lg:h-20": disabled },
          { "cursor-pointer": collapsible && !disabled },
          clickableAreaClassName,
        )}
        onClick={collapsible ? handleToggle : undefined}
      >
        <div className="flex min-w-0 flex-1 items-center gap-x-6">
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
              "flex min-w-0 flex-1",
              gated
                ? "flex-col items-start gap-y-1 lg:flex-row lg:items-center lg:justify-between"
                : "items-center justify-between",
              { "text-textInactiveColor": disabled },
              titleWrapperClassName,
            )}
          >
            <div className="flex min-w-0 items-center">
              {collapsible && signPosition === "before" && (
                <CollapsibleSign
                  sign={signType}
                  isOpen={localIsOpen}
                  position={signPosition}
                  disabled={disabled}
                  className="shrink-0"
                />
              )}
              <Text
                variant="uppercase"
                className={cn(
                  "min-w-0 text-textColor",
                  titleClassName ?? "truncate",
                  {
                    "text-textInactiveColor": disabled,
                  },
                )}
              >
                {title}
              </Text>
            </div>
            {gated ? (
              <span className="flex shrink-0 items-center gap-x-1.5 text-textColor lg:ml-4">
                <LockIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                <Text
                  variant="uppercase"
                  component="span"
                  className="text-xs leading-none"
                >
                  {disabledHint}
                </Text>
              </span>
            ) : (
              preview && <div className="shrink-0">{preview}</div>
            )}
          </div>
        </div>

        {collapsible && signPosition === "after" && (
          <CollapsibleSign
            sign={signType}
            isOpen={localIsOpen}
            position={signPosition}
            disabled={disabled}
            className="shrink-0"
          />
        )}
      </div>

      <div
        className={cn(childrenSpacingClass, {
          hidden: collapsible && !localIsOpen,
          "lg:ml-14": !collapsible && !!stage && childrenOffset !== "stage",
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
  className,
}: {
  sign: "arrow" | "plus-minus";
  isOpen: boolean;
  position: "before" | "after";
  disabled?: boolean;
  className?: string;
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
      className={cn(
        "text-textColor",
        {
          "mr-6": position === "before" && sign === "arrow",
          "mr-4": position === "before" && sign === "plus-minus",
        },
        className,
      )}
    >
      {signContent}
    </div>
  );
}

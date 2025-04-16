"use client";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export default function FieldsGroupContainer({
  stage,
  title,
  children,
  isOpen = false,
  disabled = false,
  onToggle,
}: {
  stage: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  function handleToggle() {
    onToggle();
  }

  return (
    <div className="space-y-8">
      <div
        className="flex cursor-pointer items-center justify-between"
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
          className={cn("-rotate-90 text-textColor", { "rotate-90": isOpen })}
        >
          {">"}
        </div>
      </div>
      {isOpen && <div className="space-y-8">{children}</div>}
    </div>
  );
}

"use client";

import { useContext, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { FieldsGroupContext } from "./field-group-context";

export default function FieldsGroupContainer({
  stage,
  title,
  groupName,
  children,
  defaultOpenState = false,
  disabled = false,
}: {
  stage: string;
  title: string;
  groupName: string;
  children: React.ReactNode;
  defaultOpenState?: boolean;
  disabled?: boolean;
}) {
  const { groupContextName, setGroupContextName } =
    useContext(FieldsGroupContext);

  useEffect(() => {
    if (defaultOpenState && !groupContextName) {
      setGroupContextName(groupName);
    }
  }, []);

  const isOpen = groupName === groupContextName;

  function handleToggle() {
    setGroupContextName(isOpen ? null : groupName);
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

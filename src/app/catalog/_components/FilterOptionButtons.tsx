"use client";

import {
  common_Category,
  common_Genders,
  common_OrderFactors,
  common_Size,
  common_SortFactors,
} from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function FilterOptionButtons({
  handleFilterChange,
  defaultValue,
  defaultOptionText,
  values,
}: {
  handleFilterChange: (term?: string) => void;
  defaultValue: string;
  defaultOptionText?: string;
  values:
    | common_Category[]
    | common_OrderFactors[]
    | common_SortFactors[]
    | common_Size[]
    | common_Genders[];
}) {
  return (
    <>
      {defaultOptionText && (
        <Button
          onClick={() => handleFilterChange()}
          className={cn("block", { underline: !defaultValue })}
        >
          {defaultOptionText}
        </Button>
      )}
      {values.map((factor) => (
        <Button
          onClick={() => handleFilterChange(factor.id + "")}
          className={cn("block", {
            underline: factor.id + "" === defaultValue,
          })}
          key={factor.id}
        >
          {factor.name?.toLowerCase()}
        </Button>
      ))}
    </>
  );
}

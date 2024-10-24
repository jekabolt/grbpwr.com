"use client";

import {
  common_Category,
  common_OrderFactors,
  common_Size,
  common_SortFactors,
  common_Genders,
} from "@/api/proto-http/frontend";
import { cn } from "@/lib/utils";

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
        <button
          onClick={() => handleFilterChange()}
          className={cn("block", { underline: !defaultValue })}
        >
          {defaultOptionText}
        </button>
      )}
      {values.map((factor) => (
        <button
          onClick={() => handleFilterChange(factor.id + "")}
          className={cn("block", {
            underline: factor.id + "" === defaultValue,
          })}
          key={factor.id}
        >
          {factor.name}
        </button>
      ))}
    </>
  );
}

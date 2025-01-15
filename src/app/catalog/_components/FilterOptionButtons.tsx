"use client";

import { common_Size } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function FilterOptionButtons({
  handleFilterChange,
  defaultValue,
  values,
}: {
  handleFilterChange: (term?: string) => void;
  defaultValue: string;
  values: common_Size[];
}) {
  return (
    <>
      {values.map((factor) => (
        <Button
          onClick={() => handleFilterChange(factor.id + "")}
          className={cn(
            "block border border-transparent px-5 hover:border-textColor",
            {
              "border-textColor": factor.id + "" === defaultValue,
            },
          )}
          key={factor.id}
        >
          {factor.name?.toLowerCase()}
        </Button>
      ))}
    </>
  );
}

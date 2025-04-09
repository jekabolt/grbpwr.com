"use client";

import { common_Size } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";

export default function FilterOptionButtons({
  handleFilterChange,
  defaultValue,
  values,
  topCategoryId,
}: {
  handleFilterChange: (term?: string) => void;
  defaultValue: string;
  values: common_Size[];
  topCategoryId?: string;
}) {
  const { dictionary } = useDataContext();
  const categories = dictionary?.categories;

  const category = topCategoryId
    ? categories?.find((c) => c.id === parseInt(topCategoryId))?.name
    : undefined;

  const isShoes = category?.toLowerCase().includes("shoes");

  const filteredValues = values.filter((factor) => {
    if (!topCategoryId) {
      return true;
    }

    const name = factor.name?.toLowerCase() || "";
    const isNumeric = /^\d+(\.\d+)?$/.test(name);

    return isShoes ? isNumeric : !isNumeric;
  });

  return (
    <>
      {filteredValues.map((factor) => (
        <Button
          onClick={() => handleFilterChange(factor.id + "")}
          className={cn(
            "block border-b border-transparent px-5 uppercase hover:border-textColor",
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

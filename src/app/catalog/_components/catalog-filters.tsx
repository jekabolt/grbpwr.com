"use client";

import {
  CATEGORY_DESCRIPTIONS,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/DataContext";
import { Text } from "@/components/ui/text";

import Category from "./Category";
import Size from "./Size";
import Sort from "./Sort";
import useFilterQueryParams from "./useFilterQueryParams";

export default function Filters() {
  const { dictionary } = useDataContext();
  const { defaultValue: topCategory } = useFilterQueryParams("topCategoryIds");
  const activeTopCategory = getTopCategoryName(
    dictionary?.categories || [],
    parseInt(topCategory || "0"),
  );
  const categoryDescription = CATEGORY_DESCRIPTIONS[activeTopCategory || ""];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <Category />
        <div className="flex w-auto gap-24">
          <Sort />
          <Size />
        </div>
      </div>
      <Text className="w-2/3 lowercase">{categoryDescription}</Text>
    </div>
  );
}

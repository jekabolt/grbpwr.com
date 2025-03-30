"use client";

import { common_GenderEnum } from "@/api/proto-http/frontend";
import { GENDER_MAP_REVERSE } from "@/constants";

import {
  CATEGORIES_ORDER,
  CATEGORY_TITLE_MAP,
  processCategories,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";

import useFilterQueryParams from "./useFilterQueryParams";

export function NextCategoryButton() {
  const { dictionary } = useDataContext();
  const { defaultValue: topCategoryId, handleFilterChange } =
    useFilterQueryParams("topCategoryIds");
  const { defaultValue: gender } = useFilterQueryParams("gender");
  const isMen = GENDER_MAP_REVERSE[gender as common_GenderEnum] === "men";
  const processedCategories = processCategories(dictionary?.categories || []);

  const currentCategory = processedCategories.find(
    (cat) => cat.id === parseInt(topCategoryId || "0"),
  );

  const currentCategoryName = currentCategory?.name.toLowerCase();
  const currentOrder = currentCategoryName
    ? CATEGORIES_ORDER[currentCategoryName]
    : 0;

  const nextCategoryName = Object.entries(CATEGORIES_ORDER)
    .filter(([name, order]) => {
      if (isMen && name.toLowerCase() === "dresses") {
        return false;
      }
      return order > currentOrder;
    })
    .sort(([, orderA], [, orderB]) => orderA - orderB)[0]?.[0];

  const nextCategory = processedCategories.find(
    (cat) => cat.name.toLowerCase() === nextCategoryName,
  );

  const handleClick = () => {
    handleFilterChange(nextCategory?.id.toString() || "");
  };

  return (
    <Button
      variant="main"
      size="lg"
      onClick={handleClick}
      className="uppercase"
    >
      Next:{CATEGORY_TITLE_MAP[nextCategory?.name || ""] || nextCategory?.name}
    </Button>
  );
}

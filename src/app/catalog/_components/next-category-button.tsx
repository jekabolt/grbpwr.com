"use client";

import { common_GenderEnum } from "@/api/proto-http/frontend";
import { GENDER_MAP_REVERSE } from "@/constants";

import {
  CATEGORIES_ORDER,
  CATEGORY_TITLE_MAP,
  processCategories,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
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

  // Get the original category name from dictionary to match CATEGORIES_ORDER keys
  const originalCategory = dictionary?.categories?.find(
    (cat) =>
      cat.level === "top_category" && cat.id === parseInt(topCategoryId || "0"),
  );
  const currentCategoryName =
    originalCategory?.name?.toLowerCase() ||
    currentCategory?.name.toLowerCase();
  const currentOrder = currentCategoryName
    ? CATEGORIES_ORDER[currentCategoryName]
    : 0;
  const availableCategories = Object.entries(CATEGORIES_ORDER)
    .filter(([name]) =>
      isMen && name.toLowerCase() === "dresses" ? false : true,
    )
    .sort(([, orderA], [, orderB]) => orderA - orderB);
  const nextCategories = availableCategories.filter(
    ([, order]) => order > currentOrder,
  );
  const nextCategoryEntry =
    nextCategories.length > 0 ? nextCategories[0] : availableCategories[0];
  const nextCategoryName = nextCategoryEntry?.[0];
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
      className="uppercase"
      onClick={handleClick}
    >
      Next:
      {CATEGORY_TITLE_MAP[nextCategory?.name || ""] || nextCategory?.name}
    </Button>
  );
}

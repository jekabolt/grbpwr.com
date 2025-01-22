"use client";

import { GENDER_MAP } from "@/constants";

import { getCategoryName, groupCategories } from "@/lib/categories-map";
import { useDataContext } from "@/components/DataContext";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";

export default function Category() {
  const { defaultValue: selectedCategories } = useFilterQueryParams("category");
  const { defaultValue: gender } = useFilterQueryParams("gender");
  const { dictionary } = useDataContext();
  const selectedCategoryIds = selectedCategories?.split(",") || [];
  const categoriesGroups = groupCategories(
    dictionary?.categories?.map((v) => v.name as string) || [],
  );

  const getGenderKey = (value: string) =>
    Object.entries(GENDER_MAP).find(([_, val]) => val === value)?.[0] || value;

  const getGroupTitle = () => {
    return (
      Object.entries(categoriesGroups).find(([_, group]) => {
        const groupCategoryIds = group.items.map((item) => item.id);
        return (
          groupCategoryIds.length === selectedCategoryIds.length &&
          groupCategoryIds.every((id) => selectedCategoryIds.includes(id))
        );
      })?.[1]?.title || null
    );
  };

  if (getGroupTitle() && gender) {
    return (
      <Text variant="uppercase">{`${getGenderKey(gender)}'s ${getGroupTitle()}`}</Text>
    );
  }

  return (
    <Text variant="uppercase" size="small">
      {selectedCategories
        ? selectedCategoryIds.map((id) => getCategoryName(id)).join(", ")
        : "all categories"}
    </Text>
  );
}

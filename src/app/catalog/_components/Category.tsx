"use client";

import { getCategoryName } from "@/lib/categories-map";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";

export default function Category() {
  const { defaultValue: defaultCategory } = useFilterQueryParams("category");

  return (
    <Text variant="uppercase">{`${getCategoryName(defaultCategory) || "all categories"}`}</Text>
  );
}

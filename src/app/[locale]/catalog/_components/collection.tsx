"use client";

import { useTranslations } from "next-intl";

import { useDataContext } from "@/components/contexts/DataContext";

import FilterOptionButtons from "./FilterOptionButtons";
import { useFilterSelection } from "./useFilterSelection";
import { useRouteParams } from "./useRouteParams";

export function Collection() {
  const t = useTranslations("catalog");

  const { dictionary } = useDataContext();
  const { gender } = useRouteParams();
  const { selectedValues, handleToggle } = useFilterSelection({
    filterKey: "collection",
    multiSelect: true,
  });

  return (
    <FilterOptionButtons
      handleFilterChange={handleToggle}
      selectedValues={selectedValues}
      values={dictionary?.collections || []}
      title={t("collection")}
      showSeparated={false}
      gender={gender}
    />
  );
}

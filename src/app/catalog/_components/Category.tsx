"use client";

import { getCategoryName } from "@/lib/categories-map";
import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return <Text variant="uppercase">{defaultValue}</Text>;
}

export default function Category() {
  const { dictionary } = useDataContext();
  const {
    defaultValue: defaultCategory,
    handleFilterChange: handleCategoryChange,
  } = useFilterQueryParams("category");

  return (
    <GenericPopover
      contentProps={{
        side: "bottom",
        align: "start",
      }}
      title="categories"
      openElement={
        <Trigger
          defaultValue={`${getCategoryName(defaultCategory) || "all categories"}`}
        />
      }
    >
      <div className="mb-8">
        <FilterOptionButtons
          defaultOptionText="all"
          defaultValue={defaultCategory || ""}
          handleFilterChange={handleCategoryChange}
          values={dictionary?.categories || []}
        />
      </div>
    </GenericPopover>
  );
}

"use client";

import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return (
    <Text variant="uppercase">
      sort by + <span className="underline">{defaultValue}</span>
    </Text>
  );
}

export default function Sort() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("sort");

  return (
    <GenericPopover
      contentProps={{
        sideOffset: -25,
        align: "end",
      }}
      title="sort by"
      openElement={<Trigger defaultValue={defaultValue || ""} />}
    >
      <div className="w-[251px]">
        <FilterOptionButtons
          defaultValue={defaultValue || ""}
          handleFilterChange={handleFilterChange}
          values={dictionary?.sortFactors || []}
          defaultOptionText="none"
        />
      </div>
    </GenericPopover>
  );
}

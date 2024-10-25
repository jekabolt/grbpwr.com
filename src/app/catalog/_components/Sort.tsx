"use client";

import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return (
    <div>
      sort_by <span className="underline">{defaultValue}</span>
    </div>
  );
}

export default function Sort() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("sort");

  return (
    <GenericPopover
      contentProps={{
        side: "bottom",
        align: "end",
      }}
      title="order_by"
      openElement={<Trigger defaultValue={defaultValue || ""} />}
    >
      <FilterOptionButtons
        defaultValue={defaultValue || ""}
        handleFilterChange={handleFilterChange}
        values={dictionary?.sortFactors || []}
        defaultOptionText="none"
      />
    </GenericPopover>
  );
}

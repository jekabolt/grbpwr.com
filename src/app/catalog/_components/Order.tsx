"use client";

import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return (
    <div>
      order <span className="underline">{defaultValue}</span>
    </div>
  );
}

export default function Order() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("order");

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
        defaultOptionText="none"
        defaultValue={defaultValue || ""}
        handleFilterChange={handleFilterChange}
        values={dictionary?.orderFactors || []}
      />
    </GenericPopover>
  );
}

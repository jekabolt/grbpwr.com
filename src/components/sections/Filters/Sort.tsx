"use client";

import GenericPopover from "@/components/ui/Popover";
import { useHeroContext } from "@/components/contexts/HeroContext";
import useFilterQueryParams from "./useFilterQueryParams";
import FilterOptionButtons from "./FilterOptionButtons";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return (
    <div>
      sort_by <span className="underline">{defaultValue}</span>
    </div>
  );
}

export default function Sort() {
  const { dictionary } = useHeroContext();
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

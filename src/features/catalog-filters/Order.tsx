"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";
import GenericPopover from "@/components/ui/popover";
import useFilterQueryParams from "./useFilterQueryParams";
import FilterOptionButtons from "./FilterOptionButtons";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return (
    <div>
      order <span className="underline">{defaultValue}</span>
    </div>
  );
}

export default function Order() {
  const { dictionary } = useHeroContext();
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

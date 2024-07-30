"use client";
import { useHeroContext } from "@/components/contexts/HeroContext";
import GenericPopover from "@/components/ui/Popover";
import useFilterQueryParams from "./useFilterQueryParams";
import FilterOptionButtons from "./FilterOptionButtons";

function Trigger({ defaultValue }: { defaultValue: string }) {
  return (
    <div>
      size <span className="underline">{defaultValue}</span>
    </div>
  );
}

export default function Size() {
  const { dictionary } = useHeroContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");

  return (
    <GenericPopover
      contentProps={{
        side: "bottom",
        align: "end",
      }}
      title="size"
      openElement={<Trigger defaultValue={defaultValue || ""} />}
    >
      <FilterOptionButtons
        defaultValue={defaultValue || ""}
        handleFilterChange={handleFilterChange}
        values={dictionary?.sizes || []}
        defaultOptionText="all sizes"
      />
    </GenericPopover>
  );
}

"use client";

import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

function Trigger({ defaultValue }: { defaultValue: string | undefined }) {
  return <Text variant="uppercase">size +</Text>;
}

export default function Size() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");

  return (
    <GenericPopover
      contentProps={{
        sideOffset: -25,
        align: "end",
      }}
      title="size"
      openElement={<Trigger defaultValue={defaultValue || ""} />}
    >
      <div className="w-[300px]">
        <FilterOptionButtons
          defaultValue={defaultValue || ""}
          handleFilterChange={handleFilterChange}
          values={dictionary?.sizes || []}
          defaultOptionText="all"
        />
      </div>
    </GenericPopover>
  );
}

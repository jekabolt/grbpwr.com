"use client";

import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";

function Trigger() {
  return <Text variant="uppercase">size +</Text>;
}

export default function Size() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");
  const sordedSizes = dictionary?.sizes?.sort((a, b) => {
    return (a.id || 0) - (b.id || 0);
  });
  const sizeNames = sordedSizes?.map((size) => {
    return {
      ...size,
      name: size.name || "",
    };
  });

  return (
    <GenericPopover
      contentProps={{
        sideOffset: -25,
        align: "end",
      }}
      title="size"
      openElement={<Trigger />}
    >
      <div className="grid grid-cols-4 gap-x-2 gap-y-6 px-2 py-6">
        <FilterOptionButtons
          defaultValue={defaultValue || ""}
          handleFilterChange={handleFilterChange}
          values={sizeNames || []}
        />
      </div>
    </GenericPopover>
  );
}

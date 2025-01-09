"use client";

import { common_SizeEnum } from "@/api/proto-http/frontend";

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
  const sizes = dictionary?.sizes?.map((size) => ({
    ...size,
    name: size.name?.replace("SIZE_ENUM_", "") as common_SizeEnum,
  }));

  return (
    <GenericPopover
      contentProps={{
        sideOffset: -25,
        align: "end",
      }}
      title="size"
      openElement={<Trigger />}
    >
      <div className="grid grid-flow-col grid-rows-2 gap-x-10 gap-y-6 p-6 leading-none">
        <FilterOptionButtons
          defaultValue={defaultValue || ""}
          handleFilterChange={handleFilterChange}
          values={sizes || []}
        />
      </div>
    </GenericPopover>
  );
}

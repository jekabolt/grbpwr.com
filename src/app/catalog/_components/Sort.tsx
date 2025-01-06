"use client";

import { SORT_MAP } from "@/constants";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";

function Trigger() {
  return <Text variant="uppercase">sort by +</Text>;
}

export default function Sort() {
  const { dictionary } = useDataContext();
  const { defaultValue: sortValue, handleFilterChange: handleSortChange } =
    useFilterQueryParams("sort");
  const { defaultValue: orderValue, handleFilterChange: handleOrderChange } =
    useFilterQueryParams("order");

  const handleCombinedChange = (sortFactor: string, orderFactor: string) => {
    handleSortChange(sortFactor, { order: orderFactor });
  };

  return (
    <GenericPopover
      contentProps={{
        sideOffset: -25,
        align: "end",
      }}
      title="sort by"
      openElement={<Trigger />}
    >
      <div>
        {Object.entries(SORT_MAP).map(([sortKey, sortData]) => (
          <div key={sortKey} className="mb-4">
            {sortData.orderFactors.map((orderFactor) => (
              <button
                key={`${sortKey}-${orderFactor.id}`}
                onClick={() => handleCombinedChange(sortKey, orderFactor.id)}
                className={cn("block", {
                  underline:
                    sortValue === sortKey && orderValue === orderFactor.id,
                })}
              >
                {`${sortData.label} ${orderFactor.name}`}
              </button>
            ))}
          </div>
        ))}
      </div>
    </GenericPopover>
  );
}

"use client";

import { SORT_MAP } from "@/constants";

import { cn } from "@/lib/utils";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";

function Trigger() {
  return <Text variant="uppercase">sort by +</Text>;
}

export default function Sort() {
  const { defaultValue: sortValue, handleFilterChange: handleSortChange } =
    useFilterQueryParams("sort");
  const { defaultValue: orderValue } = useFilterQueryParams("order");
  const { defaultValue: saleValue } = useFilterQueryParams("sale");

  const handleCombinedChange = (
    sortFactor: string,
    orderFactor: string,
    sale?: boolean,
  ) => {
    handleSortChange(sortFactor, {
      order: orderFactor,
      sale: sale ? "true" : "",
    });
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
          <>
            <div key={sortKey}>
              {sortData.orderFactors.map((orderFactor, index) => (
                <button
                  key={`${sortKey}-${orderFactor.factor}-${index}`}
                  onClick={() =>
                    handleCombinedChange(
                      sortKey,
                      orderFactor.factor,
                      orderFactor.sale,
                    )
                  }
                  className={cn("block", {
                    underline:
                      sortValue === sortKey &&
                      orderValue === orderFactor.factor &&
                      (!orderFactor.sale ? !saleValue : saleValue === "true"),
                  })}
                >
                  {`${orderFactor.sale ? "sale: " : sortData.label ? `${sortData.label}: ` : ""}${orderFactor.name}`}
                </button>
              ))}
            </div>
          </>
        ))}
      </div>
    </GenericPopover>
  );
}

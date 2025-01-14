"use client";

import { SORT_MAP } from "@/constants";

import { cn, getButtonText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

  return (
    <GenericPopover
      contentProps={{
        sideOffset: -25,
        align: "end",
      }}
      title="sort by"
      openElement={<Trigger />}
    >
      <div className="mr-16 space-y-2">
        {Object.entries(SORT_MAP).flatMap(([sortKey, sortData]) =>
          sortData.orderFactors.map((orderFactor, id) => {
            const isSortValuesMatch = sortValue === sortKey;
            const isOrderValuesMatch = orderValue === orderFactor.factor;
            const isSaleValuesMatch = orderFactor.sale
              ? saleValue === "true"
              : !saleValue;
            return (
              <Button
                key={`${sortKey}-${id}`}
                onClick={() =>
                  handleSortChange(sortKey, {
                    order: orderFactor.factor,
                    sale: orderFactor.sale ? "true" : "",
                  })
                }
                className={cn("block", {
                  underline:
                    isSortValuesMatch &&
                    isOrderValuesMatch &&
                    isSaleValuesMatch,
                })}
              >
                {getButtonText(sortData, orderFactor)}
              </Button>
            );
          }),
        )}
      </div>
    </GenericPopover>
  );
}

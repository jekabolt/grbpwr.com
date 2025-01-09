"use client";

import { OrderFactorOption, SORT_MAP, SortFactorConfig } from "@/constants";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";

function Trigger() {
  return <Text variant="uppercase">sort by +</Text>;
}

const getButtonText = (
  sortData: SortFactorConfig,
  orderFactor: OrderFactorOption,
): string => {
  const saleFactor = orderFactor.sale;
  const label = sortData.label ? `${sortData.label}: ` : "";
  return `${saleFactor ? "sale: " : label}${orderFactor.name}`;
};

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
          sortData.orderFactors.map((orderFactor, id) => (
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
                  sortValue === sortKey &&
                  orderValue === orderFactor.factor &&
                  (!orderFactor.sale ? !saleValue : saleValue === "true"),
              })}
            >
              {getButtonText(sortData, orderFactor)}
            </Button>
          )),
        )}
      </div>
    </GenericPopover>
  );
}

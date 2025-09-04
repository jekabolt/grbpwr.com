"use client";

import {
  common_OrderFactor,
  common_SortFactor,
} from "@/api/proto-http/frontend";
import { ORDER_MAP, SORT_MAP, SORT_MAP_URL } from "@/constants";

import { cn, getButtonText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";
import { getUrlKey } from "./utils";

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
            const isSortValuesMatch =
              sortValue ===
              getUrlKey(sortKey as common_SortFactor, SORT_MAP_URL);
            const isOrderValuesMatch =
              orderValue ===
              getUrlKey(orderFactor.factor as common_OrderFactor, ORDER_MAP);
            const isSaleValuesMatch = orderFactor.sale
              ? saleValue === "true"
              : !saleValue;
            return (
              <Button
                key={`${sortKey}-${id}`}
                onClick={() =>
                  handleSortChange(
                    getUrlKey(sortKey as common_SortFactor, SORT_MAP_URL),
                    {
                      order: getUrlKey(
                        orderFactor.factor as common_OrderFactor,
                        ORDER_MAP,
                      ),
                      sale: orderFactor.sale ? "true" : "",
                    },
                  )
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

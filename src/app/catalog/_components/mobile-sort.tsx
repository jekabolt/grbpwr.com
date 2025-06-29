"use client";

import {
  common_OrderFactor,
  common_SortFactor,
} from "@/api/proto-http/frontend";
import { ORDER_MAP, SORT_MAP, SORT_MAP_URL } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { cn, getButtonText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";
import { getUrlKey } from "./utils";

export function MobileSort() {
  const { defaultValue: sortValue, handleFilterChange: handleSortChange } =
    useFilterQueryParams("sort");
  const { defaultValue: orderValue } = useFilterQueryParams("order");
  const { defaultValue: saleValue } = useFilterQueryParams("sale");

  return (
    <DialogPrimitives.Root modal={false}>
      <DialogPrimitives.Trigger asChild>
        <Button className="uppercase">sort by +</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed bottom-0 left-0 z-40 bg-black" />
        <DialogPrimitives.Content className="fixed bottom-0 left-0 z-40 flex h-auto w-screen flex-col bg-textColor p-2 text-bgColor mix-blend-hard-light">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>

          <div className="relative mb-4 flex items-center justify-between">
            <Text variant="uppercase">sort by</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
            </DialogPrimitives.Close>
          </div>
          <div className="space-y-2 py-5">
            {Object.entries(SORT_MAP).flatMap(([sortKey, sortData]) => {
              return sortData.orderFactors.map((orderFactor, id) => {
                const isSortValuesMatch =
                  sortValue ===
                  getUrlKey(sortKey as common_SortFactor, SORT_MAP_URL);
                const isOrderValuesMatch =
                  orderValue ===
                  getUrlKey(
                    orderFactor.factor as common_OrderFactor,
                    ORDER_MAP,
                  );
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
                    className={cn("block mix-blend-exclusion", {
                      underline:
                        isSortValuesMatch &&
                        isOrderValuesMatch &&
                        isSaleValuesMatch,
                    })}
                  >
                    {getButtonText(sortData, orderFactor)}
                  </Button>
                );
              });
            })}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

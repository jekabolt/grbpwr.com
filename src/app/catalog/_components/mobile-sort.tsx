"use client";

import { SORT_MAP } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { cn, getButtonText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";

export function MobileSort() {
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
    <DialogPrimitives.Root modal={false}>
      <DialogPrimitives.Trigger asChild>
        <Button className="uppercase">sort by +</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed bottom-0 left-0 z-20 bg-black" />
        <DialogPrimitives.Content className="blackTheme fixed bottom-0 left-0 z-20 flex h-auto w-screen flex-col bg-black p-2 text-textColor">
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
            {Object.entries(SORT_MAP).flatMap(([sortKey, sortData]) =>
              sortData.orderFactors.map((orderFactor, id) => (
                <Button
                  key={`${sortKey}-${id}`}
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
                  {getButtonText(sortData, orderFactor)}
                </Button>
              )),
            )}
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

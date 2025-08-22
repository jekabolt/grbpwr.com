"use client";

import { useState } from "react";
import { CATALOG_LIMIT } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";
import { useRouteParams } from "./useRouteParams";
import { useSizeFiltering } from "./useSizeFiltering";
import { getProductsPagedQueryParams } from "./utils";

export function MobileSize() {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");
  const { gender, topCategory, subCategory } = useRouteParams();
  const { sizeOptions } = useSizeFiltering();
  const [total, setTotal] = useState(0);

  const sizes = dictionary?.sizes || [];
  const initSize = sizes?.find((s) => s.name === defaultValue)?.id?.toString();
  const [selectedSize, setSelectedSize] = useState<string>(initSize || "");

  const getSizeNameById = (id?: string) =>
    sizeOptions?.find((s) => String(s.id) === id)?.name.toLowerCase();

  const handleSizeClick = async (sizeId?: string) => {
    setSelectedSize(sizeId ?? "");

    if (!sizeId) {
      setTotal(0);
      return;
    }

    try {
      const response = await serviceClient.GetProductsPaged({
        limit: CATALOG_LIMIT,
        offset: 0,
        ...getProductsPagedQueryParams(
          {
            topCategoryIds: topCategory?.id?.toString(),
            subCategoryIds: subCategory?.id?.toString(),
            gender,
            size: getSizeNameById(sizeId),
          },
          dictionary,
        ),
      });
      setTotal(response.total ?? 0);
    } catch {
      setTotal(0);
    }
  };

  return (
    <DialogPrimitives.Root modal={false}>
      <DialogPrimitives.Trigger asChild>
        <Button className="uppercase">size +</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed bottom-0 left-0 z-40 bg-black" />
        <DialogPrimitives.Content className="blackTheme fixed bottom-0 left-0 z-40 flex h-auto w-screen flex-col bg-bgColor p-2 text-textColor mix-blend-hard-light">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-4 flex items-center justify-between">
            <Text variant="uppercase">size</Text>
            <DialogPrimitives.Close asChild>
              <Button>[x]</Button>
            </DialogPrimitives.Close>
          </div>

          <div
            className={cn("grid grid-cols-4 gap-x-2 gap-y-6 py-6", {
              "mb-10": selectedSize,
            })}
          >
            <FilterOptionButtons
              defaultValue={selectedSize || ""}
              handleFilterChange={handleSizeClick}
              values={sizeOptions || []}
              topCategoryId={topCategory?.id?.toString()}
            />
          </div>
          {selectedSize && (
            <div className="fixed inset-x-2.5 bottom-2.5 flex justify-between gap-2">
              <Button
                className="w-full uppercase"
                size="lg"
                variant="secondary"
                onClick={() => handleFilterChange(undefined)}
              >
                clear all
              </Button>
              <Button
                className="w-full uppercase"
                size="lg"
                variant="secondary"
                onClick={() => {
                  const sizeName =
                    dictionary?.sizes?.find(
                      (s) => (s.id || 0).toString() === selectedSize,
                    )?.name || "";
                  handleFilterChange(sizeName || undefined);
                }}
              >
                show {selectedSize && total > 0 ? `[${total}]` : ""}
              </Button>
            </div>
          )}
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CATALOG_LIMIT } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";
import { getProductsPagedQueryParams } from "./utils";

export function MobileSize() {
  const { dictionary } = useDataContext();
  const { defaultValue: category } = useFilterQueryParams("topCategoryIds");
  const { defaultValue: gender } = useFilterQueryParams("gender");
  const { defaultValue: size, handleFilterChange } =
    useFilterQueryParams("size");
  const [total, setTotal] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(size || "");
  const sortedSizes = dictionary?.sizes?.sort((a, b) => {
    return (a.id || 0) - (b.id || 0);
  });
  const sizeNames = sortedSizes?.map((size) => {
    return {
      ...size,
      name: size.name || "",
    };
  });

  useEffect(() => {
    if (!size) {
      setSelectedSize("");
      setTotal(0);
    }
  }, [size]);

  const handleSizeClick = async (sizeId?: string) => {
    setSelectedSize(sizeId || "");

    if (sizeId) {
      try {
        const searchParams = {
          topCategoryIds: category,
          gender,
          size: sizeId,
        };

        const response = await serviceClient.GetProductsPaged({
          limit: CATALOG_LIMIT,
          offset: 0,
          ...getProductsPagedQueryParams(searchParams),
        });

        setTotal(response.total || 0);
      } catch (error) {
        setTotal(0);
      }
    } else {
      setTotal(0);
      setSelectedSize("");
    }
  };

  return (
    <DialogPrimitives.Root modal={false}>
      <DialogPrimitives.Trigger asChild>
        <Button className="uppercase">size +</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed bottom-0 left-0 z-40 bg-black" />
        <DialogPrimitives.Content className="fixed bottom-0 left-0 z-40 flex h-auto w-screen flex-col bg-bgColor p-2">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="relative mb-4 flex items-center justify-between">
            <Text variant="uppercase">size</Text>
            <DialogPrimitives.Close asChild>
              <Button>[X]</Button>
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
              values={sizeNames || []}
              topCategoryId={category}
            />
          </div>
          {selectedSize && (
            <div className="fixed inset-x-2.5 bottom-0 flex justify-between gap-2 bg-bgColor">
              <Button
                className="w-full uppercase"
                size="lg"
                variant="main"
                onClick={() => handleFilterChange(undefined)}
              >
                clear all
              </Button>
              <Button
                className="w-full uppercase"
                size="lg"
                variant="main"
                onClick={() => handleFilterChange(selectedSize)}
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

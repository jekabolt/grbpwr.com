import { useState } from "react";
import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";
import { useRouteParams } from "./useRouteParams";
import { useSizeFiltering } from "./useSizeFiltering";
import { getProductsPagedQueryParams } from "./utils";

function Trigger() {
  return <Text variant="uppercase">size +</Text>;
}

export default function Size() {
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
    <GenericPopover
      contentProps={{
        sideOffset: -25,
        align: "end",
      }}
      title="size"
      openElement={<Trigger />}
    >
      <div
        className={cn("grid h-full grid-cols-4 gap-x-2 gap-y-6 px-2 py-6", {
          "mb-10": selectedSize,
        })}
      >
        <FilterOptionButtons
          defaultValue={selectedSize}
          handleFilterChange={handleSizeClick}
          values={sizeOptions || []}
          topCategoryId={topCategory?.id?.toString()}
        />
      </div>
      {selectedSize && (
        <div className="fixed inset-x-2.5 bottom-0 flex justify-between gap-2 bg-bgColor">
          <Button
            className="w-full uppercase"
            size="lg"
            variant="main"
            onClick={() => {
              handleSizeClick(undefined);
              handleFilterChange(undefined);
            }}
          >
            clear all
          </Button>
          <Button
            className="w-full uppercase"
            size="lg"
            variant="main"
            onClick={() => {
              const sizeName = getSizeNameById(selectedSize);
              handleFilterChange(sizeName || undefined);
            }}
          >
            show {selectedSize && total > 0 ? `[${total}]` : ""}
          </Button>
        </div>
      )}
    </GenericPopover>
  );
}

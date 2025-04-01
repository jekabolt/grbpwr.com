import { useState } from "react";
import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import GenericPopover from "@/components/ui/popover";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import useFilterQueryParams from "./useFilterQueryParams";
import { getProductsPagedQueryParams } from "./utils";

function Trigger() {
  return <Text variant="uppercase">size +</Text>;
}

export default function Size() {
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
      <div className="mb-10 grid h-full grid-cols-4 gap-x-2 gap-y-6 px-2 py-6">
        <FilterOptionButtons
          defaultValue={selectedSize}
          handleFilterChange={handleSizeClick}
          values={sizeNames || []}
          topCategoryId={category}
        />
      </div>
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
    </GenericPopover>
  );
}

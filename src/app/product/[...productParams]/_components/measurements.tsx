"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { CategoryThumbnail } from "@/components/ui/categories-thumbnails/render_thumbnail";
import { Text } from "@/components/ui/text";

import { CommonLoadingBtn } from "./common-loading-btn";
import { MeasurementsTable, Unit } from "./measurements-table";
import { useData } from "./select-size-add-to-cart/useData";
import { useHandlers } from "./select-size-add-to-cart/useHandlers";

export function Measurements({
  id,
  product,
}: {
  id: number;
  product: common_ProductFull;
}) {
  const { dictionary } = useDataContext();
  const { activeSizeId, isLoading, handleAddToCart, handleSizeSelect } =
    useHandlers({
      id,
    });

  const {
    sizes,
    measurements,
    categoryId,
    gender,
    preorder,
    isSaleApplied,
    priceMinusSale,
    priceWithSale,
    price,
  } = useData({
    product,
  });

  const [unit, setUnit] = useState(Unit.CM);
  const sizeNames = sizes?.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  return (
    <div className="bg-bgColor">
      <CategoryThumbnail
        categoryId={categoryId}
        gender={gender}
        className="h-[300px] lg:h-[400px]"
      />
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-x-2">
          <Button
            variant={unit === Unit.CM ? "underline" : undefined}
            onClick={() => setUnit(Unit.CM)}
          >
            CM
          </Button>
          <Text>/</Text>
          <Button
            variant={unit === Unit.INCHES ? "underline" : undefined}
            onClick={() => setUnit(Unit.INCHES)}
          >
            INCHES
          </Button>
        </div>

        <div className="flex items-center justify-center gap-x-4">
          {sizeNames?.map(({ id }) => (
            <Button
              key={id}
              onClick={() => handleSizeSelect(id || 0)}
              variant={activeSizeId === id ? "underline" : undefined}
              className="p-2"
            >
              <Text variant="uppercase">
                {dictionary?.sizes?.find((dictS) => dictS.id === id)?.name ||
                  ""}
              </Text>
            </Button>
          ))}
        </div>

        <div className="w-full">
          <MeasurementsTable
            type="clothing"
            selectedSize={activeSizeId}
            measurements={measurements}
            unit={unit}
          />
        </div>

        <CommonLoadingBtn
          isLoading={isLoading}
          preorder={preorder || ""}
          isSaleApplied={isSaleApplied}
          priceMinusSale={priceMinusSale}
          priceWithSale={priceWithSale}
          price={price}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

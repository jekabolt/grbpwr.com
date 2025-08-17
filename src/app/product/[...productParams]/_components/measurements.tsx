"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { MEASUREMENT_DESCRIPTIONS } from "@/constants";

import { useMeasurementStore } from "@/lib/stores/measurement/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CategoryThumbnail } from "@/components/ui/categories-thumbnails/render_thumbnail";
import { Text } from "@/components/ui/text";

import { MeasurementsTable, Unit } from "./measurements-table";
import { SizePicker } from "./size-picker";
import { useMeasurementType } from "./utils/useMeasurementType";
import { useProductSizes } from "./utils/useProductSizes";

export function Measurements({
  product,
  selectedSize,
  outOfStock,
  handleSelectSize,
}: {
  product: common_ProductFull;
  selectedSize: number;
  outOfStock?: Record<number, boolean>;
  handleSelectSize: (size: number) => void;
}) {
  const { hoveredMeasurement } = useMeasurementStore();
  const { sizes, sizeNames, sizeQuantity } = useProductSizes({
    product,
  });
  const { measurementType, subCategoryId, typeId, categoryId } =
    useMeasurementType({ product });

  const [unit, setUnit] = useState(Unit.CM);
  const isRing = measurementType === "ring";
  const isShoe = measurementType === "shoe";

  return (
    <div
      className={cn("flex h-full flex-col overflow-y-hidden bg-bgColor", {
        "overflow-y-auto": isRing || isShoe,
      })}
    >
      {hoveredMeasurement && MEASUREMENT_DESCRIPTIONS[hoveredMeasurement] && (
        <Text className="absolute left-0 top-0 z-10 w-full bg-highlightColor p-2.5 lowercase text-bgColor">
          {MEASUREMENT_DESCRIPTIONS[hoveredMeasurement]}
        </Text>
      )}
      <div className={cn("space-y-6", { "space-y-0": isRing || isShoe })}>
        <div className={cn("space-y-10", { hidden: isRing || isShoe })}>
          <div className="space-y-5">
            <CategoryThumbnail
              categoryId={categoryId}
              subCategoryId={subCategoryId}
              typeId={typeId}
              gender={
                product.product?.productDisplay?.productBody?.targetGender
              }
              measurements={product.measurements || []}
              selectedSize={selectedSize}
              className="h-[450px]"
            />
            <SizePicker
              view="line"
              sizeNames={sizeNames || []}
              activeSizeId={selectedSize}
              outOfStock={outOfStock}
              sizeQuantity={sizeQuantity}
              handleSizeSelect={handleSelectSize}
            />
          </div>
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
        </div>

        <MeasurementsTable
          type={measurementType}
          sizes={sizes || []}
          selectedSize={selectedSize}
          measurements={product.measurements || []}
          unit={unit}
          handleSelectSize={handleSelectSize}
        />
      </div>
    </div>
  );
}

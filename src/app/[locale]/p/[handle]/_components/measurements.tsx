"use client";

import { useState } from "react";
import { StorefrontColorway } from "@/api/proto-http/frontend";
import { MEASUREMENT_DESCRIPTIONS } from "@/constants";
import { useTranslations } from "next-intl";

import { colorwayMeasurements } from "@/lib/api-adapters/measurements";
import { useMeasurementStore } from "@/lib/stores/measurement/store";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
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
  isOneSize,
  handleSelectSize,
}: {
  product: StorefrontColorway;
  selectedSize: number;
  outOfStock?: Record<number, boolean>;
  isOneSize?: boolean;
  handleSelectSize: (size: number) => void;
}) {
  const { hoveredMeasurement } = useMeasurementStore();
  const { dictionary } = useDataContext();
  const { sizes, sizeNames, sizeQuantity } = useProductSizes({
    product,
  });
  const { measurementType, subCategoryId, typeId, categoryId } =
    useMeasurementType({ product });
  // Storefront size chart (StorefrontColorway.size_chart). Rows are keyed by the
  // public size ordinal; measurement names are resolved to dictionary ids so the
  // table/diagram keep matching as before.
  const measurements = colorwayMeasurements(product, dictionary?.measurements);

  // The size chart and the variants share the public size ordinal, so the selected
  // size (an ordinal) is itself the measurement row key.
  const selectedProductSizeId = selectedSize;

  const [unit, setUnit] = useState(Unit.CM);
  const isRing = measurementType === "ring";
  const isShoe = measurementType === "shoe";
  const t = useTranslations();

  const hasMeasurementsTableData =
    measurementType === "clothing" &&
    selectedProductSizeId != null &&
    measurements.some((m) => m.productSizeId === selectedProductSizeId);

  const hoveredDescriptionKey = (() => {
    if (!hoveredMeasurement) return null;

    const measurement = dictionary?.measurements?.find(
      (m: any) => m.name?.toLowerCase() === hoveredMeasurement.toLowerCase(),
    );

    const baseName: string = measurement?.name || hoveredMeasurement;

    return baseName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  })();

  const hoveredDescription = (() => {
    if (!hoveredDescriptionKey) return null;
    try {
      const key = `measurements-descriptions.${hoveredDescriptionKey}`;
      const translated = t(key as any) as string;
      if (translated && translated !== key) return translated;
    } catch (_) {}
    return MEASUREMENT_DESCRIPTIONS[hoveredDescriptionKey] || null;
  })();

  return (
    <div className="flex flex-col bg-bgColor">
      {hoveredDescription && (
        <Text className="absolute left-0 top-0 z-10 w-full bg-highlightColor p-2.5 lowercase text-bgColor">
          {hoveredDescription}
        </Text>
      )}
      <div className={cn("space-y-6", { "space-y-0": isRing || isShoe })}>
        <div className={cn("space-y-10", { hidden: isRing || isShoe })}>
          <div className="space-y-5">
            <CategoryThumbnail
              categoryId={categoryId}
              subCategoryId={subCategoryId}
              typeId={typeId}
              gender={product.display?.targetGender}
              measurements={measurements}
              selectedSize={selectedProductSizeId}
              className="h-[450px]"
              unit={unit}
            />
            <SizePicker
              view="line"
              sizeNames={sizeNames || []}
              activeSizeId={selectedSize}
              outOfStock={outOfStock}
              sizeQuantity={sizeQuantity}
              isOneSize={isOneSize}
              handleSizeSelect={handleSelectSize}
              className={cn({ "flex justify-center": isOneSize })}
            />
          </div>
          {hasMeasurementsTableData && (
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
          )}
        </div>

        <MeasurementsTable
          type={measurementType}
          sizes={sizes || []}
          selectedSize={selectedProductSizeId}
          measurements={measurements}
          unit={unit}
          handleSelectSize={handleSelectSize}
        />
      </div>
    </div>
  );
}

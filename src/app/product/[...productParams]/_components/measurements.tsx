"use client";

import { useState } from "react";
import {
  common_GenderEnum,
  common_ProductMeasurement,
  common_ProductSize,
} from "@/api/proto-http/frontend";
import { MEASUREMENT_DESCRIPTIONS } from "@/constants";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useMeasurementStore } from "@/lib/stores/measurement/store";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { CategoryThumbnail } from "@/components/ui/categories-thumbnails/render_thumbnail";
import { Text } from "@/components/ui/text";

import { LoadingButton } from "./loading-button";
import { MeasurementsTable, Unit } from "./measurements-table";
import { MeasurementType } from "./select-size-add-to-cart/useData";

export function Measurements({
  id,
  sizes,
  measurements,
  categoryId,
  subCategoryId,
  typeId,
  gender,
  preorder,
  isSaleApplied,
  priceMinusSale,
  priceWithSale,
  price,
  type,
}: {
  id: number | undefined;
  sizes: common_ProductSize[] | undefined;
  measurements: common_ProductMeasurement[];
  categoryId: number | undefined;
  subCategoryId: number | undefined;
  typeId: number | undefined;
  gender: common_GenderEnum | undefined;
  preorder: string;
  isSaleApplied: boolean;
  priceMinusSale: string;
  priceWithSale: string;
  price: string;
  type: MeasurementType;
}) {
  const { increaseQuantity } = useCart((state) => state);
  const { hoveredMeasurement } = useMeasurementStore();
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    sizes && sizes.length > 0 ? sizes[0].sizeId : undefined,
  );
  const [unit, setUnit] = useState(Unit.CM);
  const isRing = type === "ring";
  const isShoe = type === "shoe";
  const { dictionary } = useDataContext();
  const sizeNames = sizes?.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  const handleAddToCart = async () => {
    if (!selectedSize) return false;

    try {
      await increaseQuantity(id!, selectedSize?.toString() || "", 1);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSelectSize = (sizeId: number) => {
    setSelectedSize(sizeId);
  };

  return (
    <div className="flex h-full flex-col bg-bgColor">
      {hoveredMeasurement && MEASUREMENT_DESCRIPTIONS[hoveredMeasurement] && (
        <Text className="absolute left-0 top-0 z-10 w-full bg-highlightColor p-2.5 lowercase text-bgColor">
          {MEASUREMENT_DESCRIPTIONS[hoveredMeasurement]}
        </Text>
      )}
      <CategoryThumbnail
        categoryId={categoryId}
        subCategoryId={subCategoryId}
        typeId={typeId}
        gender={gender}
        measurements={measurements}
        selectedSize={selectedSize}
        className={cn("h-[450px] border border-red-500 lg:h-[450px]", {
          hidden: isRing || isShoe,
        })}
      />
      <div className="flex flex-col space-y-6">
        <div
          className={cn("flex items-center justify-center gap-x-2", {
            hidden: isRing || isShoe,
          })}
        >
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

        <div
          className={cn("flex items-center justify-center gap-x-4", {
            hidden: isRing || isShoe,
          })}
        >
          {sizeNames?.map(({ id }) => (
            <Button
              key={id}
              onClick={() => handleSelectSize(id)}
              variant={selectedSize === id ? "underline" : undefined}
              className="p-2"
            >
              <Text variant="uppercase">
                {dictionary?.sizes?.find((dictS) => dictS.id === id)?.name ||
                  ""}
              </Text>
            </Button>
          ))}
        </div>

        <div className="flex-grow overflow-hidden">
          <MeasurementsTable
            type={type}
            sizes={sizes || []}
            selectedSize={selectedSize}
            measurements={measurements}
            unit={unit}
            handleSelectSize={handleSelectSize}
          />
        </div>

        <LoadingButton
          variant="simpleReverse"
          size="lg"
          onAction={() => handleAddToCart()}
        >
          <Text variant="inherit">{preorder ? "preorder" : "add"}</Text>
          {isSaleApplied ? (
            <Text variant="inactive">
              {priceMinusSale}
              <Text component="span">{priceWithSale}</Text>
            </Text>
          ) : (
            <Text variant="inherit">{price}</Text>
          )}
        </LoadingButton>
      </div>
    </div>
  );
}

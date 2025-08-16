"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
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
import { useMeasurementType } from "./utils/useMeasurementType";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductPricing } from "./utils/useProductPricing";
import { useProductSizes } from "./utils/useProductSizes";

export function Measurements({
  id,
  product,
}: {
  product: common_ProductFull;
  id: number | undefined;
}) {
  const { dictionary } = useDataContext();
  const { increaseQuantity } = useCart((state) => state);
  const { preorder } = useProductBasics({ product });
  const { hoveredMeasurement } = useMeasurementStore();
  const { sizes, sizeNames } = useProductSizes({ product });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });
  const { measurementType, subCategoryId, typeId, categoryId } =
    useMeasurementType({ product });
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    sizes && sizes.length > 0 ? sizes[0].sizeId : undefined,
  );
  const [unit, setUnit] = useState(Unit.CM);
  const isRing = measurementType === "ring";
  const isShoe = measurementType === "shoe";

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
        gender={product.product?.productDisplay?.productBody?.targetGender}
        measurements={product.measurements || []}
        selectedSize={selectedSize}
        className={cn("h-[450px] lg:h-[450px]", {
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
            type={measurementType}
            sizes={sizes || []}
            selectedSize={selectedSize}
            measurements={product.measurements || []}
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

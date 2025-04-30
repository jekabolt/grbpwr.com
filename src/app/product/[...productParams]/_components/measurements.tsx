"use client";

import { useState } from "react";
import {
  common_Category,
  common_GenderEnum,
  common_ProductMeasurement,
  common_ProductSize,
} from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { CategoryThumbnail } from "@/components/ui/categories-thumbnails/render_thumbnail";
import { Text } from "@/components/ui/text";

import { MeasurementsTable, Unit } from "./measurements-table";
import { MeasurementType } from "./select-size-add-to-cart/useData";

export function Measurements({
  id,
  sizes,
  measurements,
  categoryId,
  subCategory,
  gender,
  type,
}: {
  id: number | undefined;
  sizes: common_ProductSize[] | undefined;
  measurements: common_ProductMeasurement[];
  categoryId: number | undefined;
  subCategory: common_Category | undefined;
  gender: common_GenderEnum | undefined;
  type: MeasurementType;
}) {
  const { increaseQuantity } = useCart((state) => state);
  const [selectedSize, setSelectedSize] = useState<number | undefined>();
  const [unit, setUnit] = useState(Unit.CM);
  const isRing = type === "ring";
  const isShoe = type === "shoe";
  const { dictionary } = useDataContext();
  const sizeNames = sizes?.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    await increaseQuantity(id!, selectedSize?.toString() || "", 1);
  };

  const handleSelectSize = (sizeId: number) => {
    setSelectedSize(sizeId);
  };

  return (
    <div className="flex h-full flex-col bg-bgColor">
      <CategoryThumbnail
        categoryId={categoryId}
        subCategory={subCategory}
        gender={gender}
        className={cn("h-[450px]", {
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
            variant={unit === Unit.IN ? "underline" : undefined}
            onClick={() => setUnit(Unit.IN)}
          >
            IN
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

        <Button
          variant="main"
          size="lg"
          disabled={!selectedSize}
          className="w-full uppercase"
          onClick={handleAddToCart}
        >
          add to cart
        </Button>
      </div>
    </div>
  );
}

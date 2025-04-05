"use client";

import React, { useState } from "react";
import {
  common_GenderEnum,
  common_ProductMeasurement,
  common_ProductSize,
} from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { CategoryThumbnail } from "@/components/ui/categories-thumbnails/render_thumbnail";
import { Text } from "@/components/ui/text";

import { MeasurementsTable, Unit } from "./measurements-table";

export function Measurements({
  id,
  sizes,
  measurements,
  categoryId,
  gender,
}: {
  id: number | undefined;
  sizes: common_ProductSize[] | undefined;
  measurements: common_ProductMeasurement[];
  categoryId: number | undefined;
  gender: common_GenderEnum | undefined;
}) {
  const { increaseQuantity } = useCart((state) => state);
  const [selectedSize, setSelectedSize] = useState<number | undefined>();
  const [unit, setUnit] = useState(Unit.CM);
  const { dictionary } = useDataContext();
  const sizeNames = sizes?.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    await increaseQuantity(id!, selectedSize?.toString() || "", 1);
  };

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
              onClick={() => setSelectedSize(id)}
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

        <div className="w-full">
          <MeasurementsTable
            type="clothing"
            selectedSize={selectedSize}
            measurements={measurements}
            unit={unit}
          />
        </div>

        <div className="flex w-full justify-end">
          <Button
            variant="main"
            size="lg"
            disabled={!selectedSize}
            className="w-full uppercase sm:w-1/2"
            onClick={handleAddToCart}
          >
            add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}

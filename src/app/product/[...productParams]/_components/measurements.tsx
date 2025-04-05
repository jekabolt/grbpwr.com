"use client";

import { useState } from "react";
import {
  common_GenderEnum,
  common_ProductSize,
} from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { CategoryThumbnail } from "@/components/ui/categories-thumbnails/render_thumbnail";
import { Overlay } from "@/components/ui/overlay";
import RadioGroupComponent from "@/components/ui/radio-group";
import { Text } from "@/components/ui/text";

const unitOptions = [
  { label: "cm", value: "cm" },
  { label: "inches", value: "inches" },
];

export function Measurements({
  id,
  sizes,
  categoryId,
  gender,
}: {
  id: number | undefined;
  sizes: common_ProductSize[] | undefined;
  categoryId: number | undefined;
  gender: common_GenderEnum | undefined;
}) {
  const { increaseQuantity } = useCart((state) => state);
  const [selectedSize, setSelectedSize] = useState<number | undefined>();
  const [unit, setUnit] = useState("cm");
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
    <div className="bg-bgColor p-2.5">
      <div className="flex h-[300px] w-full items-center justify-center bg-bgColor lg:h-[600px]">
        <CategoryThumbnail categoryId={categoryId} gender={gender} size={400} />
      </div>
      <div className="flex gap-12">
        {sizeNames?.map(({ name, id }) => (
          <Button
            key={id}
            className={`uppercase ${selectedSize === id ? "bg-black text-white" : ""}`}
            onClick={() => setSelectedSize(id)}
          >
            {dictionary?.sizes?.find((dictS) => dictS.id === id)?.name || ""}
          </Button>
        ))}

        <RadioGroupComponent
          name="unit"
          items={unitOptions}
          value={unit}
          onValueChange={setUnit}
        />

        <table>
          <tbody>
            <tr>
              <td>lenth</td>
              <td>76 cm</td>
            </tr>
            <tr>
              <td>chest</td>
              <td>43 cm</td>
            </tr>
            <tr>
              <td>shoulders</td>
              <td>34 cm</td>
            </tr>
          </tbody>
        </table>
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

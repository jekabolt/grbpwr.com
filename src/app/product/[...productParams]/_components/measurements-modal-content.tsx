"use client";

import { useState } from "react";
import {
  common_GenderEnum,
  common_ProductSize,
  common_SizeEnum,
} from "@/api/proto-http/frontend";
import { SIZE_NAME_MAP } from "@/constants";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { CategoryThumbnail } from "@/components/ui/categories-thumbnails/render_thumbnail";
import RadioGroupComponent from "@/components/ui/radio-group";
import { Text } from "@/components/ui/text";

const unitOptions = [
  { label: "cm", value: "cm" },
  { label: "inches", value: "inches" },
];

export default function MeasurementsModalContent({
  // handleAddToCartClick,
  id,
  sizes,
  setModalOpen,
  categoryId,
  gender,
}: {
  id: number | undefined;
  setModalOpen?: any;
  // handleAddToCartClick?: (selectedSize: number | undefined) => Promise<void>;
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
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)
      ?.name as common_SizeEnum,
  }));

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    await increaseQuantity(id!, selectedSize?.toString() || "", 1);
  };

  console.log("setModalOpen22");
  console.log(setModalOpen);

  useLockBodyScroll();

  return (
    <div className="h-auto w-auto  bg-bgColor">
      <div className="bottom-[-10px] left-[-500px] flex h-[614px] w-full items-center justify-center bg-bgColor sm:w-[500px] lg:absolute">
        <CategoryThumbnail categoryId={categoryId} gender={gender} size={400} />
      </div>
      <div className="grid gap-10">
        <Text variant="uppercase">measurements</Text>
        <div className="flex gap-12">
          {sizeNames?.map(({ name, id }) => (
            <Button
              key={id}
              className={`uppercase ${selectedSize === id ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedSize(id)}
            >
              {SIZE_NAME_MAP[name]}
            </Button>
          ))}
        </div>

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
        <div className="flex w-full justify-end ">
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

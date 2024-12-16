"use client";

import { useState } from "react";
import { common_ProductSize } from "@/api/proto-http/frontend";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import { Button } from "@/components/ui/button";
import DressIcon from "@/components/ui/icons/dress";
import { Text } from "@/components/ui/text";

export default function MeasurementsModalContent({
  handleAddToCartClick,
  sizes,
  setModalOpen,
}: {
  setModalOpen?: any;
  handleAddToCartClick: (selectedSize: number | undefined) => Promise<void>;
  sizes: common_ProductSize[] | undefined;
}) {
  const [selectedSize, setSelectedSize] = useState<number | undefined>();
  const [unit, setUnit] = useState("cm");

  console.log("setModalOpen22");
  console.log(setModalOpen);

  useLockBodyScroll();

  return (
    <div className="h-auto w-auto bg-bgColor">
      <div className="absolute bottom-[-10px] left-[-500px] h-[614px] w-[500px] bg-bgColor">
        <DressIcon width={500} height={614} />
      </div>
      <div className="grid gap-9">
        <Text variant="uppercase">measurements</Text>
        <div className="flex gap-12">
          {sizes?.map((size) => (
            <Button
              key={size.sizeId}
              className={`uppercase ${selectedSize === size.sizeId ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedSize(size?.sizeId)}
            >
              {size.sizeId}
            </Button>
          ))}
        </div>
        <div className="grid gap-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={unit === "cm"}
              onChange={() => setUnit("cm")}
              className="form-radio text-white"
            />
            cm
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={unit === "inches"}
              onChange={() => setUnit("inches")}
              className="form-radio text-white"
            />
            inches
          </label>
        </div>
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
          <Button variant="main" size="lg" className="w-1/2 uppercase">
            add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}

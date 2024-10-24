"use client";

import { common_ProductSize } from "@/api/proto-http/frontend";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { useState } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-black p-8 text-white">
      <div className="flex w-full max-w-6xl flex-col gap-8 md:flex-row">
        <div className="relative flex-1">
          <img
            src="/placeholder.svg?height=800&width=400"
            alt="White jeans"
            className="w-full"
          />
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">
            J
          </div>
          <div className="absolute left-0 top-1/2 bg-blue-600 px-2 py-1 text-sm">
            hi
            <br />
            43 cm
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-mono text-2xl">measurements</h1>
          </div>
          <div className="flex gap-4 text-lg">
            {sizes?.map((size) => (
              <button
                key={size.id}
                className={`uppercase ${selectedSize === size.sizeId ? "underline" : ""}`}
                onClick={() => setSelectedSize(size?.sizeId)}
              >
                {size.sizeId}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400">*select size</p>
          <button
            onClick={async () => {
              await handleAddToCartClick(selectedSize);
              setModalOpen(false);
            }}
            className="w-full bg-white px-4 py-2 text-lg font-bold text-black"
          >
            add to cart
          </button>
          <div className="flex gap-4">
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
          <table className="w-full">
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
        </div>
      </div>
    </div>
  );
}

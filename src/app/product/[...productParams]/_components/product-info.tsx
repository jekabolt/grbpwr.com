"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { CARE_INSTRUCTIONS_MAP } from "@/constants";

import { getFullComposition } from "@/lib/utils";
import Modal from "@/components/ui/modal";
import { Text } from "@/components/ui/text";

import MeasurementsModal from "./measurements-modal";
import { AddToCartForm } from "./select-size-add-to-cart/index";

export function ProductInfo({ product }: Props) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [isSizeAccordionOpen, setIsSizeAccordionOpen] = useState(false);
  const care = product.product?.productDisplay?.productBody?.careInstructions;
  const composition = product.product?.productDisplay?.productBody?.composition;
  const fullComposition = getFullComposition(composition);
  const description = product.product?.productDisplay?.productBody?.description;
  const modelHeight =
    product.product?.productDisplay?.productBody?.modelWearsHeightCm;
  const modelSize =
    product.product?.productDisplay?.productBody?.modelWearsSizeId;
  const modelWear = `model is ${modelHeight}cm and wears size ${modelSize}`;

  const fullCare = care
    ?.split(",")
    .map(
      (instruction) => CARE_INSTRUCTIONS_MAP[instruction.trim()] || instruction,
    );

  const handleSizeAccordionChange = (isOpen: boolean) => {
    setIsSizeAccordionOpen(isOpen);
  };

  return (
    <div className="border-inactive relative bottom-2.5 right-2.5 h-[245px] border bg-bgColor p-2.5 lg:absolute lg:w-[600px]">
      <div className="relative grid h-full grid-cols-2 gap-x-5">
        <div className={"flex flex-col justify-between"}>
          <Text variant="uppercase" className={openItem ? "hidden" : ""}>
            {product?.product?.productDisplay?.productBody?.name}
          </Text>
          <div className="space-y-5">
            <Modal openElement="description" customCursor>
              <div className="cursor-custom-x grid gap-1">
                {description?.split("\n").map((p, i) => (
                  <Text className="lowercase" key={i}>
                    {p}
                  </Text>
                ))}
                <Text>{modelWear}</Text>
              </div>
            </Modal>

            <Modal openElement="composition" title="composition" customCursor>
              <div className="grid gap-1">
                {fullComposition?.map((c, i) => (
                  <Text key={i}>{c ? c : ""}</Text>
                ))}
              </div>
            </Modal>

            <Modal openElement="care" title="care" customCursor>
              <div className="grid gap-1">
                {fullCare?.map((c, i) => (
                  <Text key={i}>{c ? `- ${c}` : ""}</Text>
                ))}
              </div>
            </Modal>

            <MeasurementsModal
              productId={product?.product?.id || 0}
              sizes={product?.sizes || []}
              categoryId={
                product?.product?.productDisplay?.productBody?.topCategoryId ||
                0
              }
              gender={
                product.product?.productDisplay?.productBody?.targetGender
              }
            />
          </div>
        </div>
        <AddToCartForm
          product={product}
          id={product?.product?.id || 0}
          onSizeAccordionStateChange={handleSizeAccordionChange}
        />
      </div>
    </div>
  );
}

type Props = {
  product: common_ProductFull;
};

// className={cn("grid gap-10 transition-opacity duration-200", {
//   "pointer-events-none opacity-30": isSizeAccordionOpen,
// })}

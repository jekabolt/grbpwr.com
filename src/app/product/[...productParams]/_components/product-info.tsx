"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { CARE_INSTRUCTIONS_MAP } from "@/constants";

import { cn, getFullComposition } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";

import MeasurementsModal from "./measurements-modal";
import { AddToCartForm } from "./select-size-add-to-cart/index";

export function ProductInfo({ product }: Props) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [isSizeAccordionOpen, setIsSizeAccordionOpen] = useState(false);
  const care = product.product?.productDisplay?.productBody?.careInstructions;
  const composition = product.product?.productDisplay?.productBody?.composition;
  const fullComposition = getFullComposition(composition);

  const fullCare = care
    ?.split(",")
    .map(
      (instruction) => CARE_INSTRUCTIONS_MAP[instruction.trim()] || instruction,
    );

  const handleSizeAccordionChange = (isOpen: boolean) => {
    setIsSizeAccordionOpen(isOpen);
  };

  return (
    <div className="border-inactive relative bottom-2.5 right-2.5 grid h-[245px] grid-cols-2 gap-x-5 border bg-bgColor p-2.5 lg:absolute lg:w-[600px]">
      <div className="space-y-5">
        <div
          className={cn("grid gap-10 transition-opacity duration-200", {
            "pointer-events-none opacity-30": isSizeAccordionOpen,
          })}
        >
          <Text variant="uppercase" className={openItem ? "hidden" : ""}>
            {product?.product?.productDisplay?.productBody?.name}
          </Text>
          <div className="space-y-5">
            <AccordionRoot
              type="single"
              collapsible
              className={cn("space-y-5", {
                "space-y-0": openItem,
              })}
              value={openItem}
              onValueChange={setOpenItem}
              disabled={isSizeAccordionOpen}
            >
              <AccordionItem
                value="item-1"
                className={cn("block space-y-10", {
                  hidden: openItem && openItem !== "item-1",
                })}
              >
                <AccordionTrigger>
                  <Text variant="uppercase">description</Text>
                </AccordionTrigger>
                <AccordionContent>
                  <Text className="lowercase">
                    {product.product?.productDisplay?.productBody?.description}
                  </Text>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-2"
                className={cn("block space-y-10", {
                  hidden: openItem && openItem !== "item-2",
                })}
              >
                <AccordionTrigger>
                  <Text variant="uppercase">composition</Text>
                </AccordionTrigger>
                <AccordionContent>
                  {fullComposition.map((item, index) => (
                    <Text key={index} className="lowercase">
                      {item}
                    </Text>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-3"
                className={cn("block space-y-10", {
                  hidden: openItem && openItem !== "item-3",
                })}
              >
                <AccordionTrigger>
                  <Text variant="uppercase">care</Text>
                </AccordionTrigger>
                <AccordionContent>
                  {fullCare?.map((instruction, index) => (
                    <Text key={index} className="lowercase">
                      {instruction ? `- ${instruction}` : ""}
                    </Text>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </div>
        </div>
        <div className={openItem ? "hidden" : ""}>
          <MeasurementsModal
            productId={product?.product?.id || 0}
            sizes={product?.sizes || []}
            categoryId={
              product?.product?.productDisplay?.productBody?.topCategoryId || 0
            }
            gender={product.product?.productDisplay?.productBody?.targetGender}
          />
        </div>
      </div>
      <AddToCartForm
        product={product}
        id={product?.product?.id || 0}
        onSizeAccordionStateChange={handleSizeAccordionChange}
      />
    </div>
  );
}

type Props = {
  product: common_ProductFull;
};

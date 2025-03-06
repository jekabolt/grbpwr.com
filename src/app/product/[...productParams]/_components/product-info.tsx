"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";
import { CARE_INSTRUCTIONS_MAP } from "@/constants";

import { getFullComposition } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";

import MeasurementsModal from "./measurements-modal";
import { AddToCartForm } from "./select-size-add-to-cart";

export function ProductInfo({ product }: Props) {
  const baseCurrencyPrice =
    product?.product?.productDisplay?.productBody?.price?.value;
  const care = product.product?.productDisplay?.productBody?.careInstructions;
  const composition = product.product?.productDisplay?.productBody?.composition;
  const fullComposition = getFullComposition(composition);

  const fullCare = care
    ?.split(",")
    .map(
      (instruction) => CARE_INSTRUCTIONS_MAP[instruction.trim()] || instruction,
    );

  return (
    <div className="border-inactive bottom-2.5 right-2.5 grid grid-cols-2 gap-x-5 border bg-bgColor p-2.5 lg:absolute lg:w-2/5">
      <div className="grid gap-10">
        <Text variant="uppercase">
          {product?.product?.productDisplay?.productBody?.name}
        </Text>
        <div className="space-y-5">
          <AccordionRoot type="single" collapsible className="space-y-5">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <Text variant="uppercase">description</Text>
              </AccordionTrigger>
              <AccordionContent>
                <Text className="lowercase">
                  {product.product?.productDisplay?.productBody?.description}
                </Text>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
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
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <Text variant="uppercase">care</Text>
              </AccordionTrigger>
              <AccordionContent>
                {fullCare?.map((instruction, index) => (
                  <Text key={index} className="lowercase">
                    - {instruction}
                  </Text>
                ))}
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
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
        // className="order-1 flex w-full flex-col items-center justify-between gap-y-6 lg:order-none lg:flex-row lg:gap-x-20"
        sizes={product?.sizes || []}
        id={product?.product?.id || 0}
      />
    </div>
  );
}

type Props = {
  product: common_ProductFull;
};

{
  /* <Text>
{"[CUR]"} {baseCurrencyPrice}
</Text> */
}

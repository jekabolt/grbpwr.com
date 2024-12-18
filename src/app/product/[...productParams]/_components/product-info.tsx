"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";

import MeasurementsModal from "./measurements-modal";
import { AddToCartForm } from "./select-size-add-to-cart";

export function ProductInfo({ className, product }: Props) {
  const baseCurrencyPrice =
    product?.product?.productDisplay?.productBody?.price?.value;

  return (
    <div
      className={cn(
        "relative flex h-auto flex-col gap-y-6 bg-bgColor lg:w-[600px]",
        className,
      )}
    >
      <div className="order-first flex items-center justify-between gap-x-20">
        <Text variant="uppercase" component="h1">
          {product?.product?.productDisplay?.productBody?.name}
        </Text>
        <Text>
          {"[CUR]"} {baseCurrencyPrice}
        </Text>
      </div>
      <Text className="order-last lg:order-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed at
        doloribus, iste ad itaque rem dicta laudantium iure nisi nulla deserunt,
        vel, vero quibusdam inventore cumque quis libero? Consequatur, in.
      </Text>
      <AccordionRoot
        type="single"
        collapsible
        className="order-last w-40 space-y-6 lg:order-none"
      >
        <AccordionItem value="item-1" className="space-y-4">
          <AccordionTrigger>
            <Text variant="uppercase">composition</Text>
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="space-y-4">
          <AccordionTrigger>
            <Text variant="uppercase">care</Text>
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>

      <MeasurementsModal
        productId={product?.product?.id || 0}
        sizes={product?.sizes || []}
        categoryId={
          product?.product?.productDisplay?.productBody?.categoryId || 0
        }
        gender={product.product?.productDisplay?.productBody?.targetGender}
      />
      <AddToCartForm
        className="order-first flex w-full flex-col items-center justify-between gap-y-6 lg:order-none lg:flex-row lg:gap-x-20"
        sizes={product?.sizes || []}
        id={product?.product?.id || 0}
      />
    </div>
  );
}

type Props = {
  className?: string;
  product: common_ProductFull;
};

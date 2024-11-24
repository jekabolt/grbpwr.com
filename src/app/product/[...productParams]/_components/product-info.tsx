import { common_ProductFull } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";

import { AddToCartForm } from "./select-size-add-to-cart";

export function ProductInfo({ className, product }: Props) {
  const baseCurrencyPrice =
    product?.product?.productDisplay?.productBody?.price?.value;

  return (
    <div className={cn("w-[600px] space-y-6 bg-bgColor", className)}>
      <div className="flex items-center justify-between gap-x-20">
        <Text variant="uppercase" component="h1">
          {product?.product?.productDisplay?.productBody?.name}
        </Text>
        <Text>
          {"[CUR]"} {baseCurrencyPrice}
        </Text>
      </div>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed at
        doloribus, iste ad itaque rem dicta laudantium iure nisi nulla deserunt,
        vel, vero quibusdam inventore cumque quis libero? Consequatur, in.
      </Text>
      <AccordionRoot type="single" collapsible className="w-40 space-y-6">
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

      <Text variant="underlined" size="small">
        measurements
      </Text>
      <AddToCartForm
        className="flex items-center justify-between gap-x-20"
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
"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Modal from "@/components/ui/modal";
import { Text } from "@/components/ui/text";

import { Measurements } from "./measurements";
import { AddToCartForm } from "./select-size-add-to-cart/index";
import { useData } from "./select-size-add-to-cart/useData";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  const {
    name,
    description,
    modelWearText,
    composition,
    color,
    care,
    productComposition,
    productCare,
    productId,
    sizes,
    categoryId,
    gender,
    measurements,
    measurementType,
  } = useData({
    product,
  });
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div className="grid gap-10 px-3 pt-2.5">
      <Text variant="uppercase">{name}</Text>

      <AddToCartForm id={product.product?.id || 0} product={product} />

      <Modal
        overlayProps={{
          cover: "screen",
        }}
        openElement="size guide"
        title="size guide"
        className="bottom-0 top-0 h-screen w-full p-2"
      >
        <Measurements
          id={productId}
          sizes={sizes}
          categoryId={categoryId}
          gender={gender}
          measurements={measurements}
          type={measurementType}
        />
      </Modal>

      <AccordionRoot
        collapsible
        type="single"
        value={openItem}
        onValueChange={setOpenItem}
        className="space-y-6"
      >
        <AccordionItem value="item-1" className="space-y-5">
          <AccordionTrigger useMinus>
            <Text variant="uppercase">description</Text>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {description?.split("\n").map((d, i) => (
              <Text className="lowercase" key={i}>
                {d}
              </Text>
            ))}
            <Text className="mt-3 lowercase">{modelWearText}</Text>
          </AccordionContent>
        </AccordionItem>
        {productComposition && (
          <AccordionItem value="item-2" className="space-y-5">
            <AccordionTrigger useMinus>
              <Text variant="uppercase">composition</Text>
            </AccordionTrigger>
            <AccordionContent className="grid gap-1">
              {composition?.map((c, i) => (
                <Text className="lowercase" key={i}>
                  {c}
                </Text>
              ))}
              <Text className="mt-3 lowercase">{`color: ${color}`}</Text>
            </AccordionContent>
          </AccordionItem>
        )}
        {productCare && (
          <AccordionItem value="item-3" className="space-y-5">
            <AccordionTrigger useMinus>
              <Text variant="uppercase">care</Text>
            </AccordionTrigger>
            <AccordionContent className="grid gap-1">
              {care?.map((c, i) => (
                <Text className="lowercase" key={i}>
                  {c ? `- ${c}` : ""}
                </Text>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </AccordionRoot>
    </div>
  );
}

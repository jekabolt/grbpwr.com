"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import Modal from "@/components/ui/modal";
import { Text } from "@/components/ui/text";

import { Measurements } from "./measurements";
import { AddToCartForm } from "./select-size-add-to-cart/index";
import { useData } from "./select-size-add-to-cart/useData";

export function ProductInfo({ product }: { product: common_ProductFull }) {
  const {
    description,
    composition,
    care,
    modelWearText,
    color,
    name,
    productCare,
    productComposition,
    productId,
    sizes,
    categoryId,
    gender,
  } = useData({
    product,
  });

  const [isSizeAccordionOpen, setIsSizeAccordionOpen] = useState(false);

  const handleSizeAccordionChange = (isOpen: boolean) => {
    setIsSizeAccordionOpen(isOpen);
  };

  return (
    <div className="border-inactive absolute bottom-2.5 right-2.5 h-[245px] w-[600px] border bg-bgColor p-2.5">
      <div className="grid h-full grid-cols-2 gap-x-5">
        <div className="flex flex-col justify-between">
          <Text
            variant="uppercase"
            className={cn("", {
              "pointer-events-none opacity-30": isSizeAccordionOpen,
            })}
          >
            {name}
          </Text>
          <div className="space-y-5">
            <div
              className={cn("space-y-5", {
                "pointer-events-none opacity-30": isSizeAccordionOpen,
              })}
            >
              <Modal openElement="description" customCursor>
                <div className="cursor-custom-x grid gap-1">
                  {description?.split("\n").map((d, i) => (
                    <Text className="lowercase" key={i}>
                      {d}
                    </Text>
                  ))}
                  <Text className="mt-3 lowercase">{modelWearText}</Text>
                </div>
              </Modal>

              <Modal
                shouldRender={!!productComposition}
                openElement="composition"
                title="composition"
                customCursor
              >
                <div className="grid gap-1">
                  {composition
                    ?.slice(0, 7)
                    .map((c, i) => <Text key={i}>{c ? c : ""}</Text>)}
                  <Text className="mt-3 lowercase">{`color: ${color}`}</Text>
                </div>
              </Modal>

              <Modal
                shouldRender={!!productCare}
                openElement="care"
                title="care"
                customCursor
              >
                <div className="grid gap-1">
                  {care?.map((c, i) => (
                    <Text key={i}>{c ? `- ${c}` : ""}</Text>
                  ))}
                </div>
              </Modal>
            </div>
            <Modal
              overlayProps={{
                cover: "screen",
              }}
              openElement="size guide"
              title="size guide"
              className="fixed inset-[initial] bottom-0 top-0 h-screen w-[600px] lg:bottom-2.5 lg:right-2.5 lg:top-2.5 lg:h-[calc(100vh-20px)]"
            >
              <Measurements
                id={productId}
                sizes={sizes}
                categoryId={categoryId}
                gender={gender}
              />
            </Modal>
          </div>
        </div>
        <AddToCartForm
          product={product}
          id={productId}
          onSizeAccordionStateChange={handleSizeAccordionChange}
        />
      </div>
    </div>
  );
}

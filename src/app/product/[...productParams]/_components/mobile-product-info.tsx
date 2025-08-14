"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { AccordionRoot, AccordionSection } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MobileMeasurements } from "@/components/ui/mobile-measurements";
import MobilePlate from "@/components/ui/mobile-plate";
import { Text } from "@/components/ui/text";

import { LastViewedProducts } from "./last-viewed-products";
import { MobileImageCarousel } from "./mobile-image-carousel";
import { AddToCartBtn } from "./select-size-add-to-cart/add-to-cart-btn";
import { useHandlers } from "./select-size-add-to-cart/useHandlers";
import { useGarmentInfo } from "./utils/useGarmentInfo";
import { useModelInfo } from "./utils/useModelInfo";
import { useProductBasics } from "./utils/useProductBasics";
import { useProductSizes } from "./utils/useProductSizes";

export function MobileProductInfo({
  product,
}: {
  product: common_ProductFull;
}) {
  const { name, description, productId } = useProductBasics({ product });
  const { modelWear } = useModelInfo({ product });
  const { composition, care } = useGarmentInfo({ product });
  const [infoOpenItem, setInfoOpenItem] = useState<string | undefined>(
    undefined,
  );
  const {
    activeSizeId,
    openItem,
    isLoading,
    isMobileSizeDialogOpen,
    setIsMobileSizeDialogOpen,
    handleSizeSelect,
    handleAddToCart,
  } = useHandlers({
    id: productId,
  });
  const { sizeNames } = useProductSizes({ product });

  return (
    <div className="relative h-full overflow-y-hidden">
      <div className="fixed inset-x-2.5 top-12">
        <MobileImageCarousel media={product.media || []} />
      </div>
      <MobilePlate>
        <Text variant="uppercase">{name}</Text>
        <AccordionRoot
          type="single"
          value={infoOpenItem}
          onValueChange={setInfoOpenItem}
          collapsible
          className="space-y-5"
        >
          <AccordionSection
            value="item-1"
            previewText={description}
            currentValue={infoOpenItem}
          >
            <div>
              {description?.split("\n").map((d, i) => (
                <Text variant="uppercase" key={i}>
                  {d}
                </Text>
              ))}
              {modelWear && <Text variant="uppercase">{modelWear}</Text>}
            </div>
          </AccordionSection>
          {composition && (
            <AccordionSection
              value="item-2"
              title="composition"
              currentValue={infoOpenItem}
            >
              <div className="flex flex-col">
                {composition.split("\n").map((c, i) => (
                  <Text variant="uppercase" key={i}>
                    {c}
                  </Text>
                ))}
              </div>
            </AccordionSection>
          )}
          {care && (
            <AccordionSection
              value="item-3"
              title="care"
              currentValue={infoOpenItem}
            >
              {care?.map((c, i) => (
                <Text variant="uppercase" key={i}>
                  {c}
                </Text>
              ))}
            </AccordionSection>
          )}
        </AccordionRoot>

        <div className="space-y-5">
          <MobileMeasurements id={productId} product={product} />

          <div className="grid grid-cols-4 gap-y-7">
            {sizeNames?.map(({ name, id }) => (
              <Button
                key={id}
                className={cn("uppercase", {
                  "border-b border-textColor": activeSizeId === id,
                })}
                onClick={() => handleSizeSelect(id)}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        {product.product && <LastViewedProducts product={product.product} />}
      </MobilePlate>
      <AddToCartBtn
        product={product}
        handlers={{
          activeSizeId,
          openItem,
          isLoading,
          isMobileSizeDialogOpen,
          setIsMobileSizeDialogOpen,
          handleSizeSelect,
          handleAddToCart,
        }}
      />
    </div>
  );
}

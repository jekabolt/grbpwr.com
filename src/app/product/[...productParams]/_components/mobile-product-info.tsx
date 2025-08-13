"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { AccordionRoot, AccordionSection } from "@/components/ui/accordion";
import MobilePlate from "@/components/ui/mobile-plate";
import { Text } from "@/components/ui/text";

import { LastViewedProducts } from "./last-viewed-products";
import { MobileImageCarousel } from "./mobile-image-carousel";
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
    subCategoryId,
    typeId,
    gender,
    measurements,
    preorder,
    isSaleApplied,
    priceMinusSale,
    priceWithSale,
    price,
    measurementType,
  } = useData({
    product,
  });
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div className="relative h-full overflow-y-hidden">
      <div className="fixed inset-x-2.5 top-12">
        <MobileImageCarousel media={product.media || []} />
      </div>
      <MobilePlate>
        <Text variant="uppercase" className="mb-32">
          {name}
        </Text>
        <AccordionRoot
          type="single"
          value={openItem}
          onValueChange={setOpenItem}
          collapsible
        >
          <AccordionSection
            value="item-1"
            previewText={description}
            currentValue={openItem}
          >
            <div>
              {description?.split("\n").map((d, i) => (
                <Text variant="uppercase" key={i}>
                  {d}
                </Text>
              ))}
              {modelWearText && (
                <Text variant="uppercase">{modelWearText}</Text>
              )}
            </div>
          </AccordionSection>
        </AccordionRoot>
        {product.product && <LastViewedProducts product={product.product} />}
      </MobilePlate>
    </div>
    // <div className="grid gap-10 px-2.5 pb-16 pt-2.5">
    //   <Text variant="uppercase">{name}</Text>
    //   <AddToCartForm id={product.product?.id || 0} product={product} />
    //   <MobileMeasurements
    //     id={productId}
    //     sizes={sizes}
    //     categoryId={categoryId}
    //     subCategoryId={subCategoryId}
    //     typeId={typeId}
    //     gender={gender}
    //     measurements={measurements}
    //     preorder={preorder || ""}
    //     isSaleApplied={isSaleApplied}
    //     priceMinusSale={priceMinusSale}
    //     priceWithSale={priceWithSale}
    //     price={price}
    //     type={measurementType}
    //   />
    //   <AccordionRoot
    //     collapsible
    //     type="single"
    //     value={openItem}
    //     onValueChange={setOpenItem}
    //     className="space-y-6"
    //   >
    //     <AccordionItem value="item-1" className="space-y-5">
    //       <AccordionTrigger useMinus>
    //         <Text variant="uppercase">description</Text>
    //       </AccordionTrigger>
    //       <AccordionContent className="space-y-2">
    //         {description?.split("\n").map((d, i) => (
    //           <Text className="lowercase" key={i}>
    //             {d}
    //           </Text>
    //         ))}
    //         <Text className="mt-3 lowercase">{modelWearText}</Text>
    //       </AccordionContent>
    //     </AccordionItem>
    //     {productComposition && (
    //       <AccordionItem value="item-2" className="space-y-5">
    //         <AccordionTrigger useMinus>
    //           <Text variant="uppercase">composition</Text>
    //         </AccordionTrigger>
    //         <AccordionContent className="grid gap-1">
    //           {composition?.map((c, i) => (
    //             <Text className="lowercase" key={i}>
    //               {c}
    //             </Text>
    //           ))}
    //           <Text className="mt-3 lowercase">{`color: ${color}`}</Text>
    //         </AccordionContent>
    //       </AccordionItem>
    //     )}
    //     {productCare && (
    //       <AccordionItem value="item-3" className="space-y-5">
    //         <AccordionTrigger useMinus>
    //           <Text variant="uppercase">care</Text>
    //         </AccordionTrigger>
    //         <AccordionContent className="grid gap-1">
    //           {care?.map((c, i) => (
    //             <Text className="lowercase" key={i}>
    //               {c ? `- ${c}` : ""}
    //             </Text>
    //           ))}
    //         </AccordionContent>
    //       </AccordionItem>
    //     )}
    //   </AccordionRoot>
    // </div>
  );
}

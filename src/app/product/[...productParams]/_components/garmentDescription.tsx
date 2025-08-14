"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";

import { AccordionRoot, AccordionSection } from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";

import { useGarmentInfo } from "./utils/useGarmentInfo";
import { useModelInfo } from "./utils/useModelInfo";
import { useProductBasics } from "./utils/useProductBasics";

export function GarmentDescription({
  product,
}: {
  product: common_ProductFull;
}) {
  const { description, isComposition, isCare } = useProductBasics({ product });
  const { composition, care } = useGarmentInfo({ product });
  const { modelWear } = useModelInfo({ product });

  const [infoOpenItem, setInfoOpenItem] = useState<string>("");
  return (
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
        onValueChange={setInfoOpenItem}
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
      {isComposition && (
        <AccordionSection
          value="item-2"
          title="composition"
          currentValue={infoOpenItem}
          onValueChange={setInfoOpenItem}
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
      {isCare && (
        <AccordionSection
          value="item-3"
          title="care"
          currentValue={infoOpenItem}
          onValueChange={setInfoOpenItem}
        >
          {care?.map((c, i) => (
            <Text variant="uppercase" key={i}>
              {c}
            </Text>
          ))}
        </AccordionSection>
      )}
    </AccordionRoot>
  );
}

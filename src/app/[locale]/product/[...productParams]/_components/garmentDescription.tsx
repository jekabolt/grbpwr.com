"use client";

import { useState } from "react";
import { common_ProductFull } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

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
  const { composition, compositionStructured, care, careCodes } =
    useGarmentInfo({
      product,
    });
  const { modelWear } = useModelInfo({ product });
  const t = useTranslations("product");
  const tComp = useTranslations("composition");
  const tCare = useTranslations("care");

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
          title={t("composition")}
          currentValue={infoOpenItem}
          onValueChange={setInfoOpenItem}
        >
          {compositionStructured ? (
            <div className="flex flex-col">
              {Object.entries(compositionStructured).map(
                ([sectionKey, items]) => (
                  <Text variant="uppercase" key={sectionKey}>
                    {tComp(sectionKey)}:{" "}
                    {items
                      .filter((i) => i.percent > 0)
                      .map((i) => `${tComp(i.code)} ${i.percent}%`)
                      .join(", ")}
                  </Text>
                ),
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              {composition.split("\n").map((c, i) => (
                <Text variant="uppercase" key={i}>
                  {c}
                </Text>
              ))}
            </div>
          )}
        </AccordionSection>
      )}
      {isCare && (
        <AccordionSection
          value="item-3"
          title={t("care")}
          currentValue={infoOpenItem}
          onValueChange={setInfoOpenItem}
        >
          {(careCodes?.length ? careCodes : care || []).map((c, i) => (
            <Text variant="uppercase" key={i}>
              {tCare(c)}
            </Text>
          ))}
        </AccordionSection>
      )}
    </AccordionRoot>
  );
}

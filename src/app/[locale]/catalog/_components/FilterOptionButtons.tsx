"use client";

import { common_Size } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function FilterOptionButtons({
  handleFilterChange,
  defaultValue,
  values,
  topCategoryId,
}: {
  handleFilterChange: (term?: string) => void;
  defaultValue: string;
  values: common_Size[];
  topCategoryId?: string;
}) {
  const { dictionary } = useDataContext();

  const categories = dictionary?.categories;
  const t = useTranslations("catalog");

  const category = topCategoryId
    ? categories?.find((c) => c.id === parseInt(topCategoryId))
        ?.translations?.[0]?.name
    : undefined;

  const isShoes = category?.toLowerCase().includes("shoes");

  const nonNumericValues = values.filter((factor) => {
    const name = factor.name?.toLowerCase() || "";
    return !/^\d+(\.\d+)?$/.test(name);
  });

  const numericValues = values.filter((factor) => {
    const name = factor.name?.toLowerCase() || "";
    return /^\d+(\.\d+)?$/.test(name);
  });

  const showNonNumeric = !topCategoryId || !isShoes;
  const showNumeric = !topCategoryId || isShoes;

  const renderButton = (factor: common_Size) => (
    <Button
      onClick={() => handleFilterChange(factor.id + "")}
      className={cn(
        "block border-b border-transparent px-5 uppercase hover:border-textColor",
        {
          "border-textColor": factor.id + "" === defaultValue,
        },
      )}
      key={factor.id}
    >
      {factor.name?.toLowerCase()}
    </Button>
  );

  return (
    <div
      className={cn("grid", {
        "gap-y-7": showNonNumeric && showNumeric,
      })}
    >
      {showNonNumeric && (
        <div className="space-y-6">
          <Text variant="uppercase" className="text-textInactiveColor">
            {t("size")}
          </Text>
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {nonNumericValues.map(renderButton)}
          </div>
        </div>
      )}
      {showNumeric && (
        <div className="space-y-6">
          <Text variant="uppercase" className="text-textInactiveColor">
            {t("shoe size")}
          </Text>
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {numericValues.map(renderButton)}
          </div>
        </div>
      )}
    </div>
  );
}

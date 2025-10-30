"use client";

import { useState } from "react";
import { common_Size } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function FilterOptionButtons({
  handleFilterChange,
  selectedValues,
  values,
  topCategoryId,
}: {
  handleFilterChange: (id: string) => void;
  selectedValues: string[];
  values: common_Size[];
  topCategoryId?: string;
}) {
  const { dictionary } = useDataContext();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const categories = dictionary?.categories;
  const t = useTranslations("catalog");

  const category = topCategoryId
    ? categories?.find((c) => c.id === parseInt(topCategoryId))?.name
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

  const handleClick = async (id: string) => {
    setLoadingId(id);

    // Manual delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    handleFilterChange(id);
    setLoadingId(null);
  };

  const renderButton = (factor: common_Size) => {
    const factorId = factor.id + "";
    const isSelected = selectedValues.includes(factorId);
    const isLoading = loadingId === factorId;

    return (
      <Button
        onClick={() => handleClick(factorId)}
        loading={isLoading}
        loadingReverse={isSelected}
        loadingType="overlay"
        disabled={isLoading}
        className={cn(
          "block border border-transparent uppercase hover:border-textColor",
          {
            "border-textColor": isSelected,
          },
        )}
        key={factor.id}
      >
        {factor.name?.toLowerCase()}
      </Button>
    );
  };

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

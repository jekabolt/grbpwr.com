"use client";

import { useState } from "react";
import { common_Collection, common_Size } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type FilterItem = common_Size | common_Collection;

function getItemId(item: FilterItem): string {
  return "id" in item ? String(item.id) : item.name || "";
}

function getItemName(item: FilterItem): string {
  return item.name?.toLowerCase() || "";
}

export default function FilterOptionButtons({
  selectedValues,
  values,
  topCategoryId,
  title,
  showSeparated = false,
  gender,
  handleFilterChange,
}: {
  selectedValues: string[];
  values: FilterItem[];
  topCategoryId?: string;
  title?: string;
  showSeparated?: boolean;
  gender?: string;
  handleFilterChange: (id: string) => void;
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
    const name = getItemName(factor);
    return !/^\d+(\.\d+)?$/.test(name);
  });

  const numericValues = values.filter((factor) => {
    const name = getItemName(factor);
    return /^\d+(\.\d+)?$/.test(name);
  });

  const showNonNumeric = showSeparated ? !topCategoryId || !isShoes : true;
  const showNumeric = showSeparated ? !topCategoryId || isShoes : false;

  const handleClick = async (id: string) => {
    setLoadingId(id);

    await new Promise((resolve) => setTimeout(resolve, 500));

    handleFilterChange(id);
    setLoadingId(null);
  };

  const renderButton = (factor: FilterItem) => {
    const factorId = getItemId(factor);
    const isSelected = selectedValues.includes(factorId);
    const isLoading = loadingId === factorId;
    const menCount = factor.countMen || 0;
    const womenCount = factor.countWomen || 0;

    // Check availability based on gender context
    const isAvailable =
      gender === "men"
        ? menCount > 0
        : gender === "women"
          ? womenCount > 0
          : menCount > 0 || womenCount > 0;

    return (
      <Button
        onClick={() => handleClick(factorId)}
        loading={isLoading}
        loadingReverse={isSelected}
        loadingType="overlay"
        disabled={isLoading || !isAvailable}
        className={cn(
          "block border border-transparent uppercase md:hover:border-textColor",
          {
            "border-textColor": isSelected,
          },
        )}
        key={factorId}
      >
        {getItemName(factor)}
      </Button>
    );
  };

  if (!showSeparated) {
    return (
      <div className="space-y-6">
        {title && <Text variant="uppercase">{title}</Text>}
        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
          {values.map(renderButton)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("grid", {
        "gap-y-7": showNonNumeric && showNumeric,
      })}
    >
      {showNonNumeric && (
        <div className="space-y-6">
          <Text variant="uppercase">{title || t("size")}</Text>
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {nonNumericValues.map(renderButton)}
          </div>
        </div>
      )}
      {showNumeric && (
        <div className="space-y-6">
          <Text variant="uppercase">{t("shoe size")}</Text>
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {numericValues.map(renderButton)}
          </div>
        </div>
      )}
    </div>
  );
}

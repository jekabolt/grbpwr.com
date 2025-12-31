"use client";

import { common_Collection, common_Size } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

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
  const isBottoms = category?.toLowerCase().includes("bottoms");
  const isTailored = category?.toLowerCase().includes("tailored");

  // Debug logging
  if (showSeparated) {
    console.log("FilterOptionButtons Debug:", {
      category,
      topCategoryId,
      isShoes,
      isBottoms,
      isTailored,
      totalValues: values.length,
      allValues: values.map((v) => getItemName(v)),
    });
  }

  // Regular non-numeric values (XS, S, M, L, etc.)
  const nonNumericValues = values.filter((factor) => {
    const name = getItemName(factor);
    return (
      !/^\d+(\.\d+)?$/.test(name) && // Not pure numeric
      !/_\d+bo_[mf]$/.test(name) && // Not bottoms size
      !/_\d+ta_[mf]$/.test(name) // Not tailored size
    );
  });

  // Pure numeric values (shoe sizes like 37, 38, 39)
  const numericValues = values.filter((factor) => {
    const name = getItemName(factor);
    return /^\d+(\.\d+)?$/.test(name);
  });

  // Bottoms sizes (e.g., xxs_23bo_f, xs_25bo_m)
  const bottomsValues = values.filter((factor) => {
    const name = getItemName(factor);
    return /_\d+bo_[mf]$/.test(name);
  });

  // Tailored sizes (e.g., xxs_32ta_f, xs_44ta_m)
  const tailoredValues = values.filter((factor) => {
    const name = getItemName(factor);
    return /_\d+ta_[mf]$/.test(name);
  });

  // Debug logging for filtered values
  if (showSeparated) {
    console.log("Filtered sizes:", {
      nonNumeric: nonNumericValues.length,
      numeric: numericValues.length,
      bottoms: bottomsValues.length,
      tailored: tailoredValues.length,
      nonNumericSample: nonNumericValues.slice(0, 5).map((v) => getItemName(v)),
      numericSample: numericValues.slice(0, 5).map((v) => getItemName(v)),
      bottomsSample: bottomsValues.slice(0, 5).map((v) => getItemName(v)),
      tailoredSample: tailoredValues.slice(0, 5).map((v) => getItemName(v)),
    });
  }

  const showNonNumeric = showSeparated
    ? nonNumericValues.length > 0
    : true;
  const showNumeric = showSeparated ? numericValues.length > 0 : false;
  const showBottoms = showSeparated ? bottomsValues.length > 0 : false;
  const showTailored = showSeparated ? tailoredValues.length > 0 : false;

  const handleClick = async (id: string) => {
    setLoadingId(id);

    await new Promise((resolve) => setTimeout(resolve, 500));

    handleFilterChange(id);
    setLoadingId(null);
  };

  // Extract display name from size codes
  const getDisplayName = (name: string): string => {
    // For bottoms sizes (e.g., xxs_23bo_f -> 23)
    const bottomsMatch = name.match(/_(\d+)bo_[mf]$/);
    if (bottomsMatch) {
      return bottomsMatch[1];
    }

    // For tailored sizes (e.g., xxs_32ta_f -> 32)
    const tailoredMatch = name.match(/_(\d+)ta_[mf]$/);
    if (tailoredMatch) {
      return tailoredMatch[1];
    }

    // Default: return the name as is
    return name;
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

    const displayName = getDisplayName(getItemName(factor));

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
        {displayName}
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

  const hasMultipleSections =
    [showNonNumeric, showNumeric, showBottoms, showTailored].filter(Boolean)
      .length > 1;

  return (
    <div
      className={cn("grid", {
        "gap-y-7": hasMultipleSections,
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
      {showTailored && (
        <div className="space-y-6">
          <Text variant="uppercase">{t("tailored")}</Text>
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {tailoredValues.map(renderButton)}
          </div>
        </div>
      )}
      {showBottoms && (
        <div className="space-y-6">
          <Text variant="uppercase">{t("bottoms")}</Text>
          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {bottomsValues.map(renderButton)}
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

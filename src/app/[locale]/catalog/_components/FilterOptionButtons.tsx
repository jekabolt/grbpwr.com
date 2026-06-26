"use client";

import { common_Collection, common_Size } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { cn, formatSizeName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type FilterItem = common_Size | common_Collection;

function getItemId(item: FilterItem): string {
  return "id" in item ? String(item.id) : item.name || "";
}

function getItemName(item: FilterItem): string {
  return item.name?.toLowerCase() || "";
}

function itemIsAvailable(factor: FilterItem, gender?: string): boolean {
  const menCount = factor.countMen || 0;
  const womenCount = factor.countWomen || 0;
  return gender === "men"
    ? menCount > 0
    : gender === "women"
      ? womenCount > 0
      : menCount > 0 || womenCount > 0;
}

const SIZE_PATTERNS = {
  numeric: /^\d+(\.\d+)?$/,
  bottoms: /_\d+bo_[mf]$/,
  tailored: /_\d+ta_[mf]$/,
} as const;

export default function FilterOptionButtons({
  selectedValues,
  values,
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
  const t = useTranslations("catalog");

  const isSizeType = (name: string, type: keyof typeof SIZE_PATTERNS) =>
    SIZE_PATTERNS[type].test(name);

  const isStandardSize = (name: string) =>
    !isSizeType(name, "numeric") &&
    !isSizeType(name, "bottoms") &&
    !isSizeType(name, "tailored");

  const nonNumericValues = values.filter((f) => isStandardSize(getItemName(f)));
  const numericValues = values.filter((f) =>
    isSizeType(getItemName(f), "numeric"),
  );
  const bottomsValues = values.filter((f) =>
    isSizeType(getItemName(f), "bottoms"),
  );
  const tailoredValues = values.filter((f) =>
    isSizeType(getItemName(f), "tailored"),
  );

  const showNonNumeric =
    showSeparated &&
    nonNumericValues.length > 0 &&
    nonNumericValues.some((f) => itemIsAvailable(f, gender));
  const showNumeric =
    showSeparated &&
    numericValues.length > 0 &&
    numericValues.some((f) => itemIsAvailable(f, gender));
  const showBottoms =
    showSeparated &&
    bottomsValues.length > 0 &&
    bottomsValues.some((f) => itemIsAvailable(f, gender));
  const showTailored =
    showSeparated &&
    tailoredValues.length > 0 &&
    tailoredValues.some((f) => itemIsAvailable(f, gender));

  const handleClick = (id: string) => {
    handleFilterChange(id);
  };

  const renderButton = (factor: FilterItem) => {
    const factorId = getItemId(factor);
    const isSelected = selectedValues.includes(factorId);
    const isAvailable = itemIsAvailable(factor, gender);

    const displayName = formatSizeName(getItemName(factor));

    return (
      <Button
        onClick={() => handleClick(factorId)}
        disabled={!isAvailable}
        aria-pressed={isSelected}
        className={cn(
          "flex min-h-11 items-center border border-transparent uppercase md:hover:border-textColor",
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
    if (
      values.length === 0 ||
      values.every((f) => !itemIsAvailable(f, gender))
    ) {
      return null;
    }
    return (
      <div className="space-y-6">
        {title && <Text variant="uppercase">{title}</Text>}
        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
          {values.map(renderButton)}
        </div>
      </div>
    );
  }

  if (!showNonNumeric && !showNumeric && !showBottoms && !showTailored) {
    return null;
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

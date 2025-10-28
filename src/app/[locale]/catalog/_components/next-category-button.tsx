"use client";

import Link from "next/link";
import { common_GenderEnum } from "@/api/proto-http/frontend";
import { GENDER_MAP_REVERSE } from "@/constants";
import { useTranslations } from "next-intl";

import {
  CATEGORIES_ORDER,
  CATEGORY_TITLE_MAP,
  processCategories,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";

import { useRouteParams } from "./useRouteParams";

export function NextCategoryButton() {
  const { dictionary } = useDataContext();
  const { gender, topCategory } = useRouteParams();
  const isMen = GENDER_MAP_REVERSE[gender as common_GenderEnum] === "men";
  const processedCategories = processCategories(dictionary?.categories || []);
  const t = useTranslations("catalog");

  const currentCategory = processedCategories.find(
    (cat) => cat.id === topCategory?.id,
  );

  const currentCategoryName = currentCategory?.name.toLowerCase();
  const currentOrder = currentCategoryName
    ? CATEGORIES_ORDER[currentCategoryName]
    : 0;

  const availableCategories = Object.entries(CATEGORIES_ORDER)
    .filter(([name]) =>
      isMen && name.toLowerCase() === "dresses" ? false : true,
    )
    .sort(([, orderA], [, orderB]) => orderA - orderB);

  const nextCategories = availableCategories.filter(
    ([, order]) => order > currentOrder,
  );

  const nextCategoryEntry =
    nextCategories.length > 0 ? nextCategories[0] : availableCategories[0];

  const nextCategoryName = nextCategoryEntry?.[0];

  const nextCategory = processedCategories.find(
    (cat) => cat.name.toLowerCase() === nextCategoryName,
  );

  if (currentCategoryName === "objects") {
    return null;
  }

  return (
    <Button variant="main" size="lg" className="uppercase" asChild>
      <Link href={`/catalog/${gender}/${nextCategory?.name.toLowerCase()}`}>
        {t("next")}:
        {nextCategory?.name ||
          CATEGORY_TITLE_MAP[nextCategory?.name || ""] ||
          nextCategory?.name}
      </Link>
    </Button>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { common_GenderEnum } from "@/api/proto-http/frontend";
import { GENDER_MAP_REVERSE } from "@/constants";

import {
  CATEGORIES_ORDER,
  CATEGORY_TITLE_MAP,
  getTopCategoryNameForUrl,
  processCategories,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";

import useFilterQueryParams from "./useFilterQueryParams";

export function NextCategoryButton() {
  const { dictionary } = useDataContext();
  const { defaultValue: topCategoryId } =
    useFilterQueryParams("topCategoryIds");
  const { defaultValue: gender } = useFilterQueryParams("gender");
  const router = useRouter();
  const pathname = usePathname();

  const isMen = GENDER_MAP_REVERSE[gender as common_GenderEnum] === "men";
  const processedCategories = processCategories(dictionary?.categories || []);

  const currentCategory = processedCategories.find(
    (cat) => cat.id === parseInt(topCategoryId || "0"),
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

  const handleClick = () => {
    if (nextCategory && dictionary?.categories) {
      const categoryUrlName = getTopCategoryNameForUrl(
        dictionary.categories,
        nextCategory.id,
      );
      const currentGender = GENDER_MAP_REVERSE[gender as common_GenderEnum];

      if (categoryUrlName && currentGender) {
        router.push(`/catalog/${currentGender}/${categoryUrlName}`);
      }
    }
  };

  return (
    <Button
      variant="main"
      size="lg"
      onClick={handleClick}
      className="uppercase"
    >
      Next:{CATEGORY_TITLE_MAP[nextCategory?.name || ""] || nextCategory?.name}
    </Button>
  );
}

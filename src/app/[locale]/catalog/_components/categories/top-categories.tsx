import { useTranslations } from "next-intl";

import { getTopCategoryName, isCategoryDisabled } from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { useRouteParams } from "../useRouteParams";
import { CategoryButton } from "./category-btn";

export function TopCategories() {
  const t = useTranslations("categories");
  const { gender } = useRouteParams();
  const { dictionary } = useDataContext();
  const categories = dictionary?.categories || [];

  const topCategories = dictionary?.categories
    ?.filter((c) => {
      return c.level === "top_category" && c.name !== "objects";
    })
    ?.filter((c) => {
      if (gender === "men") {
        const categoryName = getTopCategoryName(categories, c.id || 0);
        return categoryName?.toLowerCase() !== "dresses";
      }
      return true;
    })
    .sort((a, b) => (a.id || 0) - (b.id || 0));

  return (
    <div className="flex items-center selection:bg-inverted selection:text-textColor">
      {topCategories?.map((category, index) => {
        const categoryName = getTopCategoryName(categories, category.id || 0);
        const originalCategoryName = category.name?.toLowerCase() || "";

        if (!categoryName) return null;

        const href = gender
          ? `/catalog/${gender}/${categoryName.toLowerCase()}`
          : `/catalog/${categoryName.toLowerCase()}`;

        return (
          <div className="flex items-center" key={category.id}>
            <CategoryButton
              href={href}
              disabled={isCategoryDisabled(category, gender)}
            >
              {originalCategoryName ? t(originalCategoryName) : ""}
            </CategoryButton>
            {index < topCategories.length - 1 && (
              <Text component="span">{"\u00A0/\u00A0"}</Text>
            )}
          </div>
        );
      })}
    </div>
  );
}

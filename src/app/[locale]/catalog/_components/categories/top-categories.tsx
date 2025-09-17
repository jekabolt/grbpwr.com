import { getTopCategoryName } from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { useRouteParams } from "../useRouteParams";
import { isCategoryDisabled } from "./categories";
import { CategoryButton } from "./category-btn";

export function TopCategories() {
  const { gender } = useRouteParams();
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const categories = dictionary?.categories || [];

  const topCategories = dictionary?.categories
    ?.filter((c) => {
      // Always use English translation for filtering since URLs are in English
      const englishTranslation =
        c.translations?.find((t) => t.languageId === 1) || c.translations?.[0];
      return (
        c.level === "top_category" && englishTranslation?.name !== "objects"
      );
    })
    ?.filter((c) => {
      if (gender === "men") {
        // Use English name for filtering
        const categoryName = getTopCategoryName(categories, c.id || 0, 1);
        return categoryName?.toLowerCase() !== "dresses";
      }
      return true;
    })
    .sort((a, b) => (a.id || 0) - (b.id || 0));

  return (
    <div className="flex items-center gap-2">
      {topCategories?.map((category, index) => {
        // Get English name for URL
        const englishName = getTopCategoryName(categories, category.id || 0, 1);
        // Get translated name for display
        const displayName = getTopCategoryName(
          categories,
          category.id || 0,
          languageId,
        );

        if (!englishName || !displayName) return null;

        return (
          <div className="flex items-center gap-2" key={category.id}>
            <CategoryButton
              href={`/catalog/${gender}/${englishName.toLowerCase()}`}
              disabled={isCategoryDisabled(category, gender)}
            >
              {displayName}
            </CategoryButton>
            {index < topCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

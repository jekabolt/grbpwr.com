import { getTopCategoryName } from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { useRouteParams } from "../useRouteParams";
import { isCategoryDisabled } from "./categories";
import { CategoryButton } from "./category-btn";

export function TopCategories() {
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
    <div className="flex items-center gap-2">
      {topCategories?.map((category, index) => {
        const categoryName = getTopCategoryName(categories, category.id || 0);

        if (!categoryName) return null;

        // Build href: if no gender, skip it; otherwise include it
        const href = gender
          ? `/catalog/${gender}/${categoryName.toLowerCase()}`
          : `/catalog/${categoryName.toLowerCase()}`;

        return (
          <div className="flex items-center gap-2" key={category.id}>
            <CategoryButton
              href={href}
              disabled={isCategoryDisabled(category, gender)}
            >
              {categoryName}
            </CategoryButton>
            {index < topCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

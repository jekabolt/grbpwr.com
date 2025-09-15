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
    ?.filter(
      (c) =>
        c.level === "top_category" && c.translations?.[0]?.name !== "objects",
    )
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
        const name = getTopCategoryName(categories, category.id || 0);
        if (!name) return null;

        return (
          <div className="flex items-center gap-2" key={category.id}>
            <CategoryButton
              href={`/catalog/${gender}/${name.toLowerCase()}`}
              disabled={isCategoryDisabled(category, gender)}
            >
              {name}
            </CategoryButton>
            {index < topCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

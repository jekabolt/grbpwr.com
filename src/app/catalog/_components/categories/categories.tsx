import { common_Category } from "@/api/proto-http/frontend";

import { getSubCategoriesForTopCategory } from "@/lib/categories-map";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { useRouteParams } from "../useRouteParams";
import { CategoryButton } from "./category-btn";
import { TopCategories } from "./top-categories";

function filterSubCategories(
  categories: { name: string; id: number; href: string }[],
  gender: string,
) {
  if (gender === "men") {
    return categories.filter(
      (c) => !["swimwear_w", "bralettes"].includes(c.name?.toLowerCase() ?? ""),
    );
  }
  return categories.filter((c) => c.name?.toLowerCase() !== "swimwear_m");
}

export function isCategoryDisabled(category: common_Category, gender: string) {
  if (!category) return true;
  return gender === "men" ? !category.countMen : !category.countWomen;
}

export function Categories() {
  const { dictionary } = useDataContext();
  const { selectedLanguage } = useCurrency((state) => state);
  const { gender, categoryName, subCategoryName, topCategory } =
    useRouteParams();
  const categories = dictionary?.categories || [];
  const subCategories = getSubCategoriesForTopCategory(
    categories,
    topCategory?.id || 0,
    selectedLanguage,
  );
  const filteredSubCategories = filterSubCategories(subCategories, gender);

  if (!categoryName) {
    return <TopCategories />;
  }

  return (
    <div className="flex items-center gap-2">
      <CategoryButton href={`/catalog/${gender}`}>
        {categoryName}
      </CategoryButton>

      {!!filteredSubCategories.length && <Text>/</Text>}

      {filteredSubCategories.map((subCategory, index) => {
        const isDisabled = isCategoryDisabled(
          categories.find((c) => c.id === subCategory.id) as common_Category,
          gender,
        );

        return (
          <div className="flex items-center gap-1" key={subCategory.id}>
            <CategoryButton
              href={`/catalog/${gender}/${categoryName}/${subCategory.name?.toLowerCase()}`}
              variant={
                subCategoryName === subCategory.name?.toLowerCase()
                  ? "underline"
                  : "default"
              }
              disabled={isDisabled}
            >
              {subCategory.name?.replace(/_/g, " ")}
            </CategoryButton>
            {index < filteredSubCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

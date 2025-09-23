import { common_Category } from "@/api/proto-http/frontend";

import {
  getSubCategoriesForTopCategory,
  getSubCategoryName,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
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
  const { languageId } = useTranslationsStore((state) => state);

  const { gender, categoryName, subCategoryName, topCategory } =
    useRouteParams();
  const categories = dictionary?.categories || [];
  // Get subcategories with English names for URL generation
  const subCategories = getSubCategoriesForTopCategory(
    categories,
    topCategory?.id || 0,
    1, // Always use English for URL generation
  );
  const filteredSubCategories = filterSubCategories(subCategories, gender);

  if (!categoryName) {
    return <TopCategories />;
  }

  // Get translated category name for display
  const translatedCategoryName = topCategory
    ? getTopCategoryName(categories, topCategory.id || 0, languageId)
    : categoryName;

  return (
    <div className="flex items-center gap-2">
      <CategoryButton href={`/catalog/${gender}`}>
        {translatedCategoryName}
      </CategoryButton>

      {!!filteredSubCategories.length && <Text>/</Text>}

      {filteredSubCategories.map((subCategory, index) => {
        const isDisabled = isCategoryDisabled(
          categories.find((c) => c.id === subCategory.id) as common_Category,
          gender,
        );

        // Get translated name for display
        const translatedName = getSubCategoryName(
          categories,
          subCategory.id,
          languageId,
        );
        const displayName =
          translatedName?.replace(/_/g, " ") ||
          subCategory.name?.replace(/_/g, " ");

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
              {displayName}
            </CategoryButton>
            {index < filteredSubCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

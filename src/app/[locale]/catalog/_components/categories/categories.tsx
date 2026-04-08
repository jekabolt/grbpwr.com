import { common_Category } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import {
  filterSubCategories,
  getSubCategoriesForTopCategory,
  getSubCategoryName,
  getTopCategoryName,
  isCategoryDisabled,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { useRouteParams } from "../useRouteParams";
import { CategoryButton } from "./category-btn";
import { TopCategories } from "./top-categories";

export function Categories() {
  const t = useTranslations("categories");
  const { dictionary } = useDataContext();
  const { gender, categoryName, subCategoryName, topCategory } =
    useRouteParams();

  const categories = dictionary?.categories || [];
  const subCategories = getSubCategoriesForTopCategory(
    categories,
    topCategory?.id || 0,
  );
  const filteredSubCategories = filterSubCategories(subCategories, gender);

  if (!categoryName) {
    return <TopCategories />;
  }

  const topCategoryName = topCategory
    ? getTopCategoryName(categories, topCategory.id || 0)
    : categoryName;

  const baseHref = gender ? `/catalog/${gender}` : "/catalog";

  return (
    <div className="flex items-center gap-2">
      <CategoryButton href={baseHref}>
        {t((topCategoryName || categoryName || "").toLowerCase())}
      </CategoryButton>

      {!!filteredSubCategories.length && <Text>/</Text>}

      {filteredSubCategories.map((subCategory, index) => {
        const findSubCategory = categories.find(
          (c) => c.id === subCategory.id,
        ) as common_Category;

        const isDisabled = isCategoryDisabled(findSubCategory, gender);
        const subCatName = getSubCategoryName(categories, subCategory.id);

        const subCategoryHref = gender
          ? `/catalog/${gender}/${categoryName}/${subCategory.name?.toLowerCase()}`
          : `/catalog/${categoryName}/${subCategory.name?.toLowerCase()}`;

        return (
          <div className="flex items-center gap-1" key={subCategory.id}>
            <CategoryButton
              href={subCategoryHref}
              variant={
                subCategoryName === subCategory.name?.toLowerCase()
                  ? "underline"
                  : "default"
              }
              disabled={isDisabled}
            >
              {subCatName ? t(subCatName.toLowerCase()) : ""}
            </CategoryButton>
            {index < filteredSubCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

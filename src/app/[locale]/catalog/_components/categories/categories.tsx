import { common_Category } from "@/api/proto-http/frontend";

import {
  getSubCategoriesForTopCategory,
  getSubCategoryName,
  getTopCategoryName,
} from "@/lib/categories-map";
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

  if (!gender) {
    return !category.countMen && !category.countWomen;
  }

  return gender === "men" ? !category.countMen : !category.countWomen;
}

export function Categories() {
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

  // Build base href based on whether gender exists
  const baseHref = gender ? `/catalog/${gender}` : "/catalog";

  return (
    <div className="flex items-center gap-2">
      <CategoryButton href={baseHref}>{topCategoryName}</CategoryButton>

      {!!filteredSubCategories.length && <Text>/</Text>}

      {filteredSubCategories.map((subCategory, index) => {
        const findSubCategory = categories.find(
          (c) => c.id === subCategory.id,
        ) as common_Category;

        const isDisabled = isCategoryDisabled(findSubCategory, gender);
        const subCatName = getSubCategoryName(categories, subCategory.id);

        // Build subcategory href with or without gender
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
              {subCatName}
            </CategoryButton>
            {index < filteredSubCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

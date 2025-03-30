import { common_GenderEnum } from "@/api/proto-http/frontend";
import { GENDER_MAP_REVERSE } from "@/constants";

import {
  getSubCategoriesForTopCategory,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import useFilterQueryParams from "./useFilterQueryParams";

export default function Category() {
  const { defaultValue: topCategory } = useFilterQueryParams("topCategoryIds");
  const { defaultValue: gender } = useFilterQueryParams("gender");
  const {
    defaultValue: subCategory,
    handleFilterChange: handleSubCategoryChange,
  } = useFilterQueryParams("subCategoryIds");
  const { dictionary } = useDataContext();
  const categories = dictionary?.categories || [];
  const activeTopCategory = getTopCategoryName(
    categories,
    parseInt(topCategory || "0"),
  );
  const subCategories = getSubCategoriesForTopCategory(
    categories,
    parseInt(topCategory || "0"),
  );

  const filteredSubCategories =
    GENDER_MAP_REVERSE[gender as common_GenderEnum] === "men"
      ? subCategories.filter((c) => c.name.toLowerCase() !== "swimwear_w")
      : subCategories.filter((c) => c.name.toLowerCase() !== "swimwear_m");

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleSubCategoryChange(undefined)}
            className="uppercase hover:underline"
          >
            {activeTopCategory}
          </Button>
          <Text>/</Text>
        </div>
        <div className="flex gap-2">
          {filteredSubCategories.map((subCategoryItem, index) => (
            <div className="flex items-center gap-1" key={subCategoryItem.id}>
              <Button
                variant={
                  subCategory === subCategoryItem.id.toString()
                    ? "underline"
                    : "default"
                }
                className="uppercase hover:underline"
                onClick={() =>
                  handleSubCategoryChange(subCategoryItem.id.toString())
                }
                disabled={
                  subCategory && subCategory !== subCategoryItem.id.toString()
                }
              >
                {subCategoryItem.name.replace("_", " ")}
              </Button>
              {index < subCategories.length - 1 && <Text>/</Text>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

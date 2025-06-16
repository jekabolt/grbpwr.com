"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  getSubCategoriesForTopCategory,
  getTopCategoryName,
} from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function Category() {
  const params = useParams();
  const { dictionary } = useDataContext();

  const pathParts = (params.params as string[]) || [];
  const [gender, categoryName, subCategoryName] = pathParts;

  const categories = dictionary?.categories || [];

  const topCategory = categories.find(
    (c) => c.name?.toLowerCase() === categoryName,
  );

  const subCategories = getSubCategoriesForTopCategory(
    categories,
    topCategory?.id || 0,
  );

  const filteredSubCategories =
    gender === "men"
      ? subCategories.filter((c) => c.name.toLowerCase() !== "swimwear_w")
      : subCategories.filter((c) => c.name.toLowerCase() !== "swimwear_m");

  return (
    <div>
      {!categoryName ? (
        <AllCategories />
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Button asChild className="uppercase hover:underline">
              <Link href={`/catalog/${gender}/${categoryName}`}>
                {categoryName}
              </Link>
            </Button>
            {!!subCategories.length && <Text>/</Text>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filteredSubCategories.map((subCategoryItem, index) => (
              <div className="flex items-center gap-1" key={subCategoryItem.id}>
                <Button
                  asChild
                  variant={
                    subCategoryName === subCategoryItem.name.toLowerCase()
                      ? "underline"
                      : "default"
                  }
                  className={cn("whitespace-nowrap uppercase hover:underline", {
                    "text-textInactiveColor":
                      subCategoryName &&
                      subCategoryName !== subCategoryItem.name.toLowerCase(),
                  })}
                >
                  <Link
                    href={`/catalog/${gender}/${categoryName}/${subCategoryItem.name.toLowerCase()}`}
                  >
                    {subCategoryItem.name.replace(/_/g, " ")}
                  </Link>
                </Button>
                {index < filteredSubCategories.length - 1 && <Text>/</Text>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AllCategories() {
  const params = useParams();
  const { dictionary } = useDataContext();
  const categories = dictionary?.categories || [];
  const [gender] = (params.params as string[]) || [];

  const topCategories = dictionary?.topCategories
    ?.filter((c) => c.categoryName !== "objects")
    .sort((a, b) => (a.categoryId || 0) - (b.categoryId || 0));

  return (
    <div className="flex items-center gap-2">
      {topCategories?.map((c, i) => {
        const name = getTopCategoryName(categories, c.categoryId || 0);
        if (!name) return null;

        return (
          <div className="flex items-center gap-2" key={c.categoryId}>
            <Button
              asChild
              className="uppercase hover:underline"
              disabled={c.count === 0}
            >
              <Link href={`/catalog/${gender}/${name.toLowerCase()}`}>
                {name}
              </Link>
            </Button>
            {i < topCategories.length - 1 && <Text>/</Text>}
          </div>
        );
      })}
    </div>
  );
}

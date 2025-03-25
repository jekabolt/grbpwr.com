import { common_Category } from "@/api/proto-http/frontend";

export const LEFT_SIDE_CATEGORIES = [
  "outerwear",
  "tops",
  "bottoms",
  "dresses",
  "loungewear_sleepwear",
] as const;

export const RIGHT_SIDE_CATEGORIES = ["bags", "shoes", "accessories"] as const;

export const RIGHT_SIDE_CATEGORIES_ORDER: Record<string, number> = {
  bags: 0,
  shoes: 1,
  accessories: 2,
} as const;

export const CATEGORY_TITLE_MAP: Record<string, string> = {
  "loungewear_sleepwear": "loungewear",
} as const;

interface ProcessedCategory {
  id: number;
  name: string;
  href: string;
  subCategories: {
    id: number;
    name: string;
    href: string;
    types: {
      id: number;
      name: string;
      href: string;
    }[];
  }[];
}

export const processCategories = (
  categories: common_Category[],
): ProcessedCategory[] => {
  const topCategories = categories.filter(
    (cat) => cat.level === "top_category",
  );

  return topCategories.map((topCat) => {
    const subCategories = categories.filter(
      (cat) => cat.level === "sub_category" && cat.parentId === topCat.id!,
    );

    if (subCategories.length === 0) {
      const directTypes = categories.filter(
        (cat) => cat.level === "type" && cat.parentId === topCat.id!,
      );

      return {
        id: topCat.id!,
        name: topCat.name!,
        href: `/catalog?topCategoryIds=${topCat.id}`,
        subCategories: [
          {
            id: topCat.id!,
            name: topCat.name!,
            href: `/catalog?category=${topCat.id}`,
            types: directTypes.map((type) => ({
              id: type.id!,
              name: type.name!,
              href: `/catalog?category=${type.id}`,
            })),
          },
        ],
      };
    }

    const processedSubCategories = subCategories.map((subCat) => {
      const types = categories.filter(
        (cat) => cat.level === "type" && cat.parentId === subCat.id!,
      );

      return {
        id: subCat.id!,
        name: subCat.name!,
        href: `/catalog?category=${subCat.id}`,
        types: types.map((type) => ({
          id: type.id!,
          name: type.name!,
          href: `/catalog?category=${type.id}`,
        })),
      };
    });

    return {
      id: topCat.id!,
      name: topCat.name!,
      href: `/catalog?topCategoryIds=${topCat.id}`,
      subCategories: processedSubCategories,
    };
  });
};

export function filterNAvigationLinks(
  links: { title: string; href: string; id: string }[],
) {
  const leftSideCategoryLinks = links.filter((link) =>
    LEFT_SIDE_CATEGORIES.includes(
      link.title.toLowerCase() as (typeof LEFT_SIDE_CATEGORIES)[number],
    ),
  );

  const rightSideCategoryLinks = links
    .filter((link) =>
      RIGHT_SIDE_CATEGORIES.includes(
        link.title.toLowerCase() as (typeof RIGHT_SIDE_CATEGORIES)[number],
      ),
    )
    .sort(
      (a, b) =>
        RIGHT_SIDE_CATEGORIES_ORDER[a.title.toLowerCase()] -
        RIGHT_SIDE_CATEGORIES_ORDER[b.title.toLowerCase()],
    );

  return {
    leftSideCategoryLinks,
    rightSideCategoryLinks,
  };
}

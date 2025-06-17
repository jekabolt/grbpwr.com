import { common_Category, common_GenderEnum } from "@/api/proto-http/frontend";

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  outerwear: "Utilitarian, dark forms. Outerwear crafted from leather, fleece, softshell and hardshell materials. This page features bombers, blazers, trenches, peacoats, parkas & duffle coats. Designed to resist rain, block wind, and protect against snow.",
  tops: "Layered essentials, adaptive forms. Tops crafted from linen, mesh, cotton, and lightweight knits. Includes shirts, t-shirts, tanks, sweaters, hoodies, & sweatshirts — in cropped, graphic, zipped, or classic cuts. Made to breathe, move and adapt.",
  bottoms: "Defined lines, functional shapes. Bottoms crafted from denim, leather, and technical cotton blends. Includes trousers, cargos, joggers, shorts, and skirts — in cropped, pleated, wrap, or drop-crotch styles. Designed for utility, comfort and motion.",
  dresses: "Fluid forms, minimal structure. Dresses crafted from mesh, cotton, and flowing blends. Created to combine and evolve.",
  loungewear_men: "Rest & rhythm for men. Loungewear and sleepwear in cotton, mesh, lace, and waffle textures. Includes boxers, briefs, bralettes, and robes — classic, relaxed, belted, or wrapped. Adaptive, for comfort and motion.",
  loungewear_women: "Rest & rhythm for women. Loungewear and sleepwear in cotton, mesh, lace, and waffle textures. Includes boxers, briefs, bralettes, and robes — classic, relaxed, belted, or wrapped. Adaptive, for comfort and motion.",
  accessories: "Not ornaments, function in form. Accessories include jewelry. Gloves, hats, socks, belts, and scarves crafted in leather, silk, cashmere, and cotton. Made to layer and finish.",
  shoes: "Form follows function. Footwear includes boots, heels, flats, sneakers, sandals, slippers, and loafers — from ankle to tall, high-top to low, flat to heeled. Designed for stability.",
  bags: "Carriers of form and function. Backpacks, shoulder bags, totes, and handle styles. Built to hold, organize, and adapt across context and time.",
  objects: "Created to be observed."
}

export const CATEGORIES_ORDER: Record<string, number> = {
  outerwear: 0,
  tops: 1,
  bottoms: 2,
  dresses: 3,
  loungewear: 4,
  accessories: 5,
  shoes: 6,
  bags: 7,
}

export const LEFT_SIDE_CATEGORIES = [
  "outerwear",
  "tops",
  "bottoms",
  "dresses",
  "loungewear",
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

    const originalName = topCat.name?.toLowerCase() ?? "";
    const displayName = CATEGORY_TITLE_MAP[originalName] || originalName;

    if (subCategories.length === 0) {
      return {
        id: topCat.id!,
        name: displayName,
        href: `/catalog/${displayName.toLowerCase()}`,
        subCategories: [
          {
            id: topCat.id!,
            name: displayName,
            href: `/catalog/${displayName.toLowerCase()}`,
          },
        ],
      };
    }

    const processedSubCategories = subCategories.map((subCat) => ({
      id: subCat.id!,
      name: subCat.name!,
      href: `/catalog/${displayName.toLowerCase()}/${subCat.name!.toLowerCase()}`,
    }));

    return {
      id: topCat.id!,
      name: displayName,
      href: `/catalog/${displayName.toLowerCase()}`,
      subCategories: processedSubCategories,
    };
  });
};

export function findCategoryByName(
  categories: common_Category[],
  name: string | undefined,
  parentId?: number,
): common_Category | undefined {
  if (!name) return undefined;

  const level = parentId ? "sub_category" : "top_category";

  return categories.find((cat) => {
    const nameMatch = cat.name?.toLowerCase() === name.toLowerCase();
    const levelMatch = cat.level === level;

    if (level === "sub_category") {
      return nameMatch && levelMatch && cat.parentId === parentId;
    }

    return nameMatch && levelMatch;
  });
}

export function getTopCategoryName(
  categories: common_Category[],
  topCategoryId: number
): string | null {
  const topCategory = categories.find(
    (cat) => cat.level === "top_category" && cat.id === topCategoryId
  );

  if (!topCategory || !topCategory.name) {
    return null;
  }

  if (CATEGORY_TITLE_MAP[topCategory.name.toLowerCase()]) {
    return CATEGORY_TITLE_MAP[topCategory.name.toLowerCase()];
  }

  return topCategory.name;
}

export function getSubCategoriesForTopCategory(
  categories: common_Category[],
  topCategoryId: number
): ProcessedCategory["subCategories"] {
  const processed = processCategories(categories);
  const topCategory = processed.find(cat => cat.id === topCategoryId);
  return topCategory?.subCategories || [];
}

export function getCategoryDescription(category: string, gender?: common_GenderEnum): string {
  if (category.toLowerCase() === "loungewear" && gender) {
    const genderKey = gender === "GENDER_ENUM_MALE" ? "loungewear_men" : "loungewear_women";
    return CATEGORY_DESCRIPTIONS[genderKey] || "";
  }
  return CATEGORY_DESCRIPTIONS[category.toLowerCase()] || "";
}

export function filterNavigationLinks(
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

export function resolveCategories(
  categories: common_Category[] | undefined,
  categoryName?: string,
  subCategoryName?: string,
) {
  const safeCategories = categories || [];
  let topCategory = findCategoryByName(safeCategories, categoryName);

  // Fallback: try to resolve category using CATEGORY_TITLE_MAP aliases
  if (!topCategory && categoryName) {
    topCategory = safeCategories.find((cat) => {
      const originalName = cat.name?.toLowerCase() ?? "";
      const displayName = CATEGORY_TITLE_MAP[originalName] || originalName;
      return displayName.toLowerCase() === categoryName.toLowerCase();
    });
  }

  const subCategory = findCategoryByName(
    safeCategories,
    subCategoryName,
    topCategory?.id,
  );

  return { topCategory, subCategory } as const;
}
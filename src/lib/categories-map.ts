const CATEGORIES = [
  {
    id: 1,
    name: "CATEGORY_ENUM_T_SHIRT",
    label: "T-Shirts",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 2,
    name: "CATEGORY_ENUM_JEANS",
    label: "Jeans",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 3,
    name: "CATEGORY_ENUM_DRESS",
    label: "Dresses",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 4,
    name: "CATEGORY_ENUM_JACKET",
    label: "Jackets",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 5,
    name: "CATEGORY_ENUM_SWEATER",
    label: "Sweaters",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 6,
    name: "CATEGORY_ENUM_PANT",
    label: "Pants",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 7,
    name: "CATEGORY_ENUM_SKIRT",
    label: "Skirts",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 8,
    name: "CATEGORY_ENUM_SHORT",
    label: "Shorts",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 9,
    name: "CATEGORY_ENUM_BLAZER",
    label: "Blazers",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 10,
    name: "CATEGORY_ENUM_COAT",
    label: "Coats",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 11,
    name: "CATEGORY_ENUM_SOCKS",
    label: "Socks",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 12,
    name: "CATEGORY_ENUM_UNDERWEAR",
    label: "Underwear",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 13,
    name: "CATEGORY_ENUM_BRA",
    label: "Bras",
    href: "/catalog",
    group: "clothing",
  },
  {
    id: 14,
    name: "CATEGORY_ENUM_HAT",
    label: "Hats",
    href: "/catalog",
    group: "accessories",
  },
  {
    id: 15,
    name: "CATEGORY_ENUM_SCARF",
    label: "Scarves",
    href: "/catalog",
    group: "accessories",
  },
  {
    id: 16,
    name: "CATEGORY_ENUM_GLOVES",
    label: "Gloves",
    href: "/catalog",
    group: "accessories",
  },
  {
    id: 18,
    name: "CATEGORY_ENUM_BELT",
    label: "Belts",
    href: "/catalog",
    group: "accessories",
  },
  {
    id: 20,
    name: "CATEGORY_ENUM_BAG",
    label: "Bags",
    href: "/catalog",
    group: "accessories",
  },
  {
    id: 17,
    name: "CATEGORY_ENUM_SHOES",
    label: "Shoes",
    href: "/catalog",
    group: "shoes",
  },
  {
    id: 19,
    name: "CATEGORY_ENUM_OTHER",
    label: "Other",
    href: "/catalog",
    group: "other",
  },
] as const;

export const CATEGORY_GROUPS = {
  clothing: {
    title: "clothing",
    order: 1,
  },
  accessories: {
    title: "accessories",
    order: 2,
  },
  shoes: {
    title: "shoes",
    order: 3,
  },
  other: {
    title: "other",
    order: 4,
  },
} as const;

export type CategoryGroup = keyof typeof CATEGORY_GROUPS;

export function groupCategories(categoriesEnums: string[]) {
  const categories = CATEGORIES.filter((category) =>
    categoriesEnums.includes(category.name),
  );

  const grouped = Object.entries(CATEGORY_GROUPS)
    .sort(([, a], [, b]) => a.order - b.order)
    .reduce(
      (acc, [groupKey, groupData]) => {
        return {
          ...acc,
          [groupKey]: {
            title: groupData.title,
            items: categories.filter((category) => category.group === groupKey),
          },
        };
      },
      {} as Record<
        CategoryGroup,
        { title: string; items: (typeof CATEGORIES)[number][] }
      >,
    );

  return grouped;
}

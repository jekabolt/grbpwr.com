const CATEGORIES = [
  {
    id: "1",
    name: "CATEGORY_ENUM_T_SHIRT",
    label: "T-Shirts",
    href: "/catalog?category=1",
    group: "clothing",
  },
  {
    id: "2",
    name: "CATEGORY_ENUM_JEANS",
    label: "Jeans",
    href: "/catalog?category=2",
    group: "clothing",
  },
  {
    id: "3",
    name: "CATEGORY_ENUM_DRESS",
    label: "Dresses",
    href: "/catalog?category=3",
    group: "clothing",
  },
  {
    id: "4",
    name: "CATEGORY_ENUM_JACKET",
    label: "Jackets",
    href: "/catalog?category=4",
    group: "clothing",
  },
  {
    id: "5",
    name: "CATEGORY_ENUM_SWEATER",
    label: "Sweaters",
    href: "/catalog?category=5",
    group: "clothing",
  },
  {
    id: "6",
    name: "CATEGORY_ENUM_PANT",
    label: "Pants",
    href: "/catalog?category=6",
    group: "clothing",
  },
  {
    id: "7",
    name: "CATEGORY_ENUM_SKIRT",
    label: "Skirts",
    href: "/catalog?category=7",
    group: "clothing",
  },
  {
    id: "8",
    name: "CATEGORY_ENUM_SHORT",
    label: "Shorts",
    href: "/catalog?category=8",
    group: "clothing",
  },
  {
    id: "9",
    name: "CATEGORY_ENUM_BLAZER",
    label: "Blazers",
    href: "/catalog?category=9",
    group: "clothing",
  },
  {
    id: "10",
    name: "CATEGORY_ENUM_COAT",
    label: "Coats",
    href: "/catalog?category=10",
    group: "clothing",
  },
  {
    id: "11",
    name: "CATEGORY_ENUM_SOCKS",
    label: "Socks",
    href: "/catalog?category=11",
    group: "clothing",
  },
  {
    id: "12",
    name: "CATEGORY_ENUM_UNDERWEAR",
    label: "Underwear",
    href: "/catalog?category=12",
    group: "clothing",
  },
  {
    id: "13",
    name: "CATEGORY_ENUM_BRA",
    label: "Bras",
    href: "/catalog?category=13",
    group: "clothing",
  },
  {
    id: "14",
    name: "CATEGORY_ENUM_HAT",
    label: "Hats",
    href: "/catalog?category=14",
    group: "accessories",
  },
  {
    id: "15",
    name: "CATEGORY_ENUM_SCARF",
    label: "Scarves",
    href: "/catalog?category=15",
    group: "accessories",
  },
  {
    id: "16",
    name: "CATEGORY_ENUM_GLOVES",
    label: "Gloves",
    href: "/catalog?category=16",
    group: "accessories",
  },
  {
    id: "18",
    name: "CATEGORY_ENUM_BELT",
    label: "Belts",
    href: "/catalog?category=17",
    group: "accessories",
  },
  {
    id: "20",
    name: "CATEGORY_ENUM_BAG",
    label: "Bags",
    href: "/catalog?category=18",
    group: "accessories",
  },
  {
    id: "17",
    name: "CATEGORY_ENUM_SHOES",
    label: "Shoes",
    href: "/catalog?category=19",
    group: "shoes",
  },
  {
    id: "19",
    name: "CATEGORY_ENUM_OTHER",
    label: "Other",
    href: "/catalog?category=19",
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

export function findCategoryName(value: string | undefined) {
  return CATEGORIES.find((category) => category.id === value)?.label;
}

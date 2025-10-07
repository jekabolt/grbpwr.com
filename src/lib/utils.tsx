import type {
  common_ProductFull,
  common_ProductSize,
  common_Size,
} from "@/api/proto-http/frontend";
import {
  COMPOSITION_MAP,
  COUNTRIES_BY_REGION,
  OrderFactorOption,
  RING_SIZE_CONVERSION,
  SHOES_SIZE_CONVERSION,
  SortFactorConfig,
} from "@/constants";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  CATEGORY_TITLE_MAP,
  filterNavigationLinks,
  processCategories,
} from "./categories-map";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAspectRatio(
  width: number | undefined,
  height: number | undefined,
) {
  if (!width || !height) {
    return "4/3";
  }
  return `${width}/${height}`;
}

export const getButtonText = (
  sortData: SortFactorConfig,
  orderFactor: OrderFactorOption,
  t: (key: string) => string,
): string => {
  const saleFactor = orderFactor.sale;
  const label = sortData.label ? `${t(sortData.label)}: ` : "";
  const salePrefix = saleFactor ? `${t("sort.sale")}: ` : "";
  return `${saleFactor ? salePrefix : label}${t(orderFactor.name)}`;
};

export function getFullComposition(composition: string | undefined): string[] {
  if (!composition) return [];

  const compositionObj = composition.split(",").reduce(
    (obj, item) => {
      const [key, value] = item.trim().split(":");
      obj[key] = value;
      return obj;
    },
    {} as Record<string, string>,
  );

  return Object.entries(compositionObj).map(([key, value]) => {
    const materialName = COMPOSITION_MAP[key] || key;
    return `${materialName}: ${value}%`;
  });
}

export function calculatePriceWithSale(
  price: string | undefined,
  salePercentage: string | undefined,
): number {
  const basePrice = parseFloat(price || "0");
  const discount = parseInt(salePercentage || "0");

  return (basePrice * (100 - discount)) / 100;
}

export function formatSizeData(
  sizes: common_ProductSize[],
  type: "shoe" | "ring",
  dictionary: common_Size[],
) {
  const tableType =
    type === "shoe" ? SHOES_SIZE_CONVERSION : RING_SIZE_CONVERSION;

  return sizes
    .filter((size) => size.id !== undefined)
    .map((size) => {
      const name = dictionary.find((item) => item.id === size.sizeId)?.name;
      const tableData = tableType[name as keyof typeof tableType];

      if (!tableData) return undefined;

      return {
        id: size.sizeId,
        eu: tableData.EU,
        us: tableData.US,
        uk: tableData.UK,
        cm: tableData.CM,
      };
    })
    .sort((a, b) => parseFloat(a?.eu || "") - parseFloat(b?.eu || ""));
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

export function isDateTodayOrFuture(date: string): boolean {
  const inputDate = new Date(date);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
}

export function createMenuItems(
  isBigMenuEnabled: boolean | undefined,
  setActiveCategory: (category: "men" | "women" | undefined) => void,
): { label: string; showArrow: boolean; href: string; action?: () => void }[] {
  return [
    ...(["men", "women"] as const).map((gender) => ({
      label: gender,
      action: isBigMenuEnabled ? () => setActiveCategory(gender) : undefined,
      showArrow: true,
      href: `/catalog/${gender}`,
    })),
    {
      label: "objects",
      showArrow: false,
      href: "/catalog/objects",
    },
    {
      label: "timeline",
      showArrow: false,
      href: "/timeline",
    },
  ];
}

export function createActiveCategoryMenuItems(
  activeCategory: "men" | "women" | undefined,
  dictionary?: { categories?: any[] },
) {
  if (!activeCategory) return { leftCategories: [], rightCategories: [] };

  const categories = processCategories(dictionary?.categories || []);
  const categoryLinks = categories.map((category: any) => ({
    title: category.name,
    href: category.href,
    id: category.id.toString(),
  }));

  const { leftSideCategoryLinks, rightSideCategoryLinks } =
    filterNavigationLinks(categoryLinks);

  const filteredLeftCategories =
    activeCategory === "men"
      ? leftSideCategoryLinks.filter(
          (c: any) => c.title.toLowerCase() !== "dresses",
        )
      : leftSideCategoryLinks;

  return {
    leftCategories: filteredLeftCategories,
    rightCategories: rightSideCategoryLinks,
  };
}

export function getHeroNavLink(heroNav?: {
  featuredTag?: string;
  featuredArchiveId?: string;
}) {
  if (!heroNav) return "";
  return heroNav.featuredTag
    ? `/catalog?tag=${heroNav.featuredTag}`
    : `/timeline?id=${heroNav.featuredArchiveId}`;
}

export function getCategoryDisplayName(title: string) {
  return CATEGORY_TITLE_MAP[title] || title;
}

export function isVideo(mediaUrl: string | undefined): boolean {
  if (!mediaUrl) return false;

  const extension = mediaUrl.split(".").pop()?.toLowerCase();
  const videoExtensions = new Set([
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
    "flv",
    "wmv",
    "mpeg",
    "mpg",
    "m4v",
    "3gp",
    "ogv",
  ]);

  return extension ? videoExtensions.has(extension) : false;
}

export function getCountryName(countryCode?: string, preferredLng?: string) {
  if (!countryCode) return undefined;
  const codeLc = countryCode.toLowerCase();
  const lng = preferredLng?.toLowerCase();

  const countries = Object.values(COUNTRIES_BY_REGION)
    .flat()
    .filter((c) => c.countryCode.toLowerCase() === codeLc);

  const match =
    countries.find((c) => c.lng.toLowerCase() === lng) || countries[0];
  return match?.name || countryCode.toUpperCase();
}

export function getTotalProductQuantity(product: common_ProductFull): number {
  if (!product?.sizes || product.sizes.length === 0) {
    return 0;
  }

  return product.sizes.reduce((total, size) => {
    const quantity = parseInt(size.quantity?.value || "0");
    return total + quantity;
  }, 0);
}

export function getTotalProductValue(product: common_ProductFull): number {
  if (!product?.sizes || product.sizes.length === 0) {
    return 0;
  }

  const price = parseInt(
    product.product?.productDisplay?.productBody?.productBodyInsert?.price
      ?.value || "0",
  );
  const salePercentage = parseInt(
    product.product?.productDisplay?.productBody?.productBodyInsert
      ?.salePercentage?.value || "0",
  );
  const finalPrice =
    salePercentage > 0 ? price - (price * salePercentage) / 100 : price;

  return product.sizes.reduce((total, size) => {
    const quantity = parseInt(size.quantity?.value || "0");
    return total + quantity * finalPrice;
  }, 0);
}

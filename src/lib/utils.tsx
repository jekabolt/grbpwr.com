import type {
  common_ProductSize,
  common_Size,
} from "@/api/proto-http/frontend";
import {
  COMPOSITION_MAP,
  OrderFactorOption,
  RING_SIZE_CONVERSION,
  SHOES_SIZE_CONVERSION,
  SortFactorConfig,
} from "@/constants";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
): string => {
  const saleFactor = orderFactor.sale;
  const label = sortData.label ? `${sortData.label}: ` : "";
  return `${saleFactor ? "sale: " : label}${orderFactor.name}`;
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
  console.log(inputDate, today);
  return inputDate >= today;
}

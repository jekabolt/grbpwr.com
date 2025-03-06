import {
  COMPOSITION_MAP,
  OrderFactorOption,
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

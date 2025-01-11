import { OrderFactorOption, SortFactorConfig } from "@/constants";
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

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
  availableSizeData: { id: number; name: string }[],
  type: "shoe" | "ring",
) {
  const conversionTable =
    type === "shoe" ? SHOES_SIZE_CONVERSION : RING_SIZE_CONVERSION;

  const formattedData = availableSizeData.map((sizeData) => {
    const conversionData = Object.values(conversionTable).find(
      (data) => data.EU === sizeData.name,
    );

    if (!conversionData) return null;

    return {
      id: sizeData.id,
      eu: conversionData.EU,
      us: conversionData.US,
      uk: conversionData.UK,
      cm: conversionData.CM,
    };
  });

  return formattedData.sort(
    (a, b) => parseFloat(a?.eu || "") - parseFloat(b?.eu || ""),
  );
}

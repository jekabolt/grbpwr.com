import { common_ProductFull } from "@/api/proto-http/frontend";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shouldInsertEmpty(index: number) {
  const row = Math.floor(index / 4) % 6;
  const column = index % 4;
  switch (row) {
    case 0:
      if (column === 2) {
        return true;
      }
      break;
    case 1:
      if (column === 1) {
        return true;
      }
      break;
    case 2:
      if (column === 0) {
        return true;
      }
      break;
    case 3:
      if (column === 1) {
        return true;
      }
      break;
    case 4:
      if (column === 2) {
        return true;
      }
      break;
    case 5:
      if (column === 3) {
        return true;
      }
      break;
  }
  return false;
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

export function getProductPrice(
  product: common_ProductFull | undefined,
): number {
  return (
    Number(product?.product?.productDisplay?.productBody?.price?.value) || 0
  );
}

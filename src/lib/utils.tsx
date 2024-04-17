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

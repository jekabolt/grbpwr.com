import type { common_OrderItem } from "@/api/proto-http/frontend";

function isValidDate(date: string): boolean {
  if (!date) return false;

  const parsedDate = new Date(date);
  const isValid = !isNaN(parsedDate.getTime());
  const isAfterYear2000 = parsedDate.getFullYear() > 2000;

  return isValid && isAfterYear2000;
}

export function getPreorderDate(product: common_OrderItem): string | null {
  if (!product?.preorder || !isValidDate(product.preorder)) return null;

  const date = new Date(product.preorder);

  return `ship by ${date.toLocaleDateString().replace(/\//g, ".")}`;
}

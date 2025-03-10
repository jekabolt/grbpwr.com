import type { common_OrderItem, common_ProductFull } from "@/api/proto-http/frontend";

function isValidDate(date: string): boolean {
  if (!date) return false;

  const parsedDate = new Date(date);
  const isValid = !isNaN(parsedDate.getTime());
  const isAfterYear2000 = parsedDate.getFullYear() > 2000;

  return isValid && isAfterYear2000;
}

export function getPreorderDate(product: common_OrderItem | common_ProductFull): string | null {
  const preorderDate = 'preorder' in product ? product.preorder : product.product?.productDisplay?.productBody?.preorder;
  if (!preorderDate || !isValidDate(preorderDate)) return null;

  const date = new Date(preorderDate);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `ship by ${day}.${month}.${year}`;
}

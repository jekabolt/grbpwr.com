import type { common_OrderItem } from "@/api/proto-http/frontend";

function isValidDate(date: string): boolean {
  if (!date) return false;

  const parsedDate = new Date(date);
  const isValid = !isNaN(parsedDate.getTime());
  const isAfterYear2000 = parsedDate.getFullYear() > 2000;

  return isValid && isAfterYear2000;
}

// Preorder is carried on the order line (OrderItem.preorder). The lean storefront
// colourway projection no longer exposes a preorder date, so the product page's
// own preorder badge degrades to absent (R3).
export function getPreorderDate(
  product: common_OrderItem,
  t: (key: string) => string,
): string | null {
  const preorderDate = product.preorder;
  if (!preorderDate || !isValidDate(preorderDate)) return null;

  const date = new Date(preorderDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${t("ship by")} ${day}.${month}.${year}`;
}

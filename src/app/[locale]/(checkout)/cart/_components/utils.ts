import type { common_OrderItem } from "@/api/proto-http/frontend";

function isValidDate(date: string): boolean {
  if (!date) return false;

  const parsedDate = new Date(date);
  const isValid = !isNaN(parsedDate.getTime());
  const isAfterYear2000 = parsedDate.getFullYear() > 2000;

  return isValid && isAfterYear2000;
}

// formatPreorderDate renders a preorder timestamp as "ship by DD.MM.YYYY", or null
// when there is no valid future date. Shared by the order line (OrderItem.preorder)
// and the product page (StorefrontColorwayDisplay.preorder).
export function formatPreorderDate(
  preorderDate: string | undefined,
  t: (key: string) => string,
): string | null {
  if (!preorderDate || !isValidDate(preorderDate)) return null;

  const date = new Date(preorderDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${t("ship by")} ${day}.${month}.${year}`;
}

export function getPreorderDate(
  product: common_OrderItem,
  t: (key: string) => string,
): string | null {
  return formatPreorderDate(product.preorder, t);
}

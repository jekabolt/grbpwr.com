import { pushCustomEvent } from "../utils";

interface SizeSelectedEvent {
  product_id: string;
  product_name: string;
  size_id: number;
  size_name: string;
  product_category: string;
  in_stock: boolean;
}

export function sendSizeSelectedEvent(data: SizeSelectedEvent): void {
  pushCustomEvent("size_selected", {
    product_id: data.product_id,
    product_name: data.product_name,
    size_id: data.size_id,
    size_name: data.size_name,
    product_category: data.product_category,
    in_stock: data.in_stock,
  });
}

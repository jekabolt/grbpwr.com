import type { common_OrderItem } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import ItemRow from "@/app/[locale]/(checkout)/cart/_components/ItemRow";

export function OrderProductsList({
  className,
  orderItems,
}: {
  className?: string;
  orderItems: common_OrderItem[];
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {orderItems.map((item, i) => (
        <ItemRow
          key={item?.id + "" + item.orderId + i}
          product={item}
          hideQuantityButtons
        />
      ))}
    </div>
  );
}

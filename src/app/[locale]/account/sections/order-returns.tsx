import { useCallback, useEffect, useState } from "react";
import { common_OrderFull, StorefrontAccount } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { OrderItem } from "../_components/order-item";
import { OrderReturnsSectionFallback } from "../_components/section-fallbacks";

type OrderReturnsView = "orders" | "returns";
const RETURN_STATUS_IDS = new Set([6, 7, 8, 9]);

const ORDER_RETURNS_LABELS = [
  {
    label: "orders list",
    value: "orders",
  },
  {
    label: "returns",
    value: "returns",
  },
];

export function OrderReturns({ account }: { account: StorefrontAccount }) {
  const [orders, setOrders] = useState<common_OrderFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<OrderReturnsView>("orders");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/account/orders?limit=100&offset=0", {
        method: "GET",
      });
      if (!res.ok) {
        setOrders([]);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as {
        orders?: common_OrderFull[];
      };
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="w-full space-y-16">
      <div className="flex gap-3">
        {ORDER_RETURNS_LABELS.map((label) => (
          <Button
            key={label.value}
            onClick={() => setView(label.value as OrderReturnsView)}
            className={cn("uppercase", {
              "text-textInactiveColor": view !== label.value,
            })}
            variant={view === label.value ? "underline" : "default"}
          >
            {label.label}
          </Button>
        ))}
      </div>
      {isLoading ? <OrderReturnsSectionFallback /> : null}
      {!isLoading && view === "orders" ? <OrdersList orders={orders} account={account} /> : null}
      {!isLoading && view === "returns" ? <ReturnsList orders={orders} account={account} /> : null}
    </div>
  );
}

function OrdersList({
  orders,
  account,
}: {
  orders: common_OrderFull[];
  account: StorefrontAccount;
}) {
  const nonReturnOrders = orders.filter(
    (order) => !RETURN_STATUS_IDS.has(order.order?.orderStatusId ?? 0),
  );

  return (
    <div className="max-h-[450px] overflow-y-auto">
      {nonReturnOrders.map((order) => (
        <OrderItem key={order.order?.id} order={order} account={account} />
      ))}
    </div>
  );
}

function ReturnsList({
  orders,
  account,
}: {
  orders: common_OrderFull[];
  account: StorefrontAccount;
}) {
  const returnOrders = orders.filter((order) =>
    RETURN_STATUS_IDS.has(order.order?.orderStatusId ?? 0),
  );

  return (
    <div className="max-h-[450px] overflow-y-auto">
      {returnOrders.map((order) => (
        <OrderItem key={order.order?.id} order={order} account={account} />
      ))}
    </div>
  );
}

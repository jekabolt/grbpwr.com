import { useState } from "react";
import { common_OrderFull, StorefrontAccount } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { OrderItem } from "../_components/order-item";
import { OrderReturnsSectionFallback } from "../_components/section-fallbacks";
import { useOrders } from "../utils/use-orders";

type OrderReturnsView = "orders" | "returns";

const RETURN_STATUS_IDS = new Set([6, 7, 8, 9]);

const ORDER_RETURNS_LABELS = [
  { label: "orders list", value: "orders" },
  { label: "returns", value: "returns" },
] as const;

export function OrderReturns({ account }: { account: StorefrontAccount }) {
  const [view, setView] = useState<OrderReturnsView>("orders");
  const { allOrders, loading, loadingMore, hasMore, loadMore } = useOrders();

  return (
    <div className="w-full space-y-16">
      <div className="flex gap-3">
        {ORDER_RETURNS_LABELS.map((label) => (
          <Button
            key={label.value}
            onClick={() => setView(label.value)}
            className={cn("uppercase", {
              "text-textInactiveColor": view !== label.value,
            })}
            variant={view === label.value ? "underline" : "default"}
          >
            {label.label}
          </Button>
        ))}
      </div>

      {loading ? <OrderReturnsSectionFallback /> : null}

      {!loading && view === "orders" ? (
        <OrdersList
          orders={allOrders}
          account={account}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      ) : null}

      {!loading && view === "returns" ? (
        <ReturnsList
          orders={allOrders}
          account={account}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      ) : null}
    </div>
  );
}

type ListProps = {
  orders: common_OrderFull[];
  account: StorefrontAccount;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

function OrdersList({
  orders,
  account,
  hasMore,
  loadingMore,
  onLoadMore,
}: ListProps) {
  const visible = orders.filter(
    (o) => !RETURN_STATUS_IDS.has(o.order?.orderStatusId ?? 0),
  );

  return (
    <div className="flex flex-col gap-0">
      {visible.map((order) => (
        <OrderItem key={order.order?.id} order={order} account={account} />
      ))}
      {hasMore && (
        <Button
          className="mt-6 self-start uppercase"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "loading..." : "load more"}
        </Button>
      )}
    </div>
  );
}

function ReturnsList({
  orders,
  account,
  hasMore,
  loadingMore,
  onLoadMore,
}: ListProps) {
  const visible = orders.filter((o) =>
    RETURN_STATUS_IDS.has(o.order?.orderStatusId ?? 0),
  );

  return (
    <div className="flex flex-col gap-0">
      {visible.map((order) => (
        <OrderItem key={order.order?.id} order={order} account={account} />
      ))}
      {hasMore && (
        <Button
          className="mt-6 self-start uppercase"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "loading..." : "load more"}
        </Button>
      )}
    </div>
  );
}

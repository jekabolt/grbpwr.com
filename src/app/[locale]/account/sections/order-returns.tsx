"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { common_OrderFull, StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text as UIText } from "@/components/ui/text";

import { OrderItem } from "../_components/order-item";
import { OrderReturnsSectionFallback } from "../_components/section-fallbacks";
import { useOrders } from "../utils/use-orders";

type OrderReturnsView = "orders" | "returns";

const RETURN_STATUS_IDS = new Set([6, 7, 8, 9]);

const ORDER_RETURN_TABS: {
  labelKey: "orders list" | "returns";
  value: OrderReturnsView;
}[] = [
  { labelKey: "orders list", value: "orders" },
  { labelKey: "returns", value: "returns" },
];

export function OrderReturns({ account }: { account: StorefrontAccount }) {
  const t = useTranslations("account");
  const [view, setView] = useState<OrderReturnsView>("orders");
  const { allOrders, loading, loadingMore, hasMore, loadMore } = useOrders();

  return (
    <div className="w-full space-y-16">
      <div className="flex gap-3">
        {ORDER_RETURN_TABS.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setView(tab.value)}
            className={cn("uppercase", {
              "text-textInactiveColor": view !== tab.value,
            })}
            variant={view === tab.value ? "underline" : "default"}
          >
            {t(tab.labelKey)}
          </Button>
        ))}
      </div>

      {loading ? <OrderReturnsSectionFallback /> : null}

      {!loading && view === "orders" && (
        <OrdersList
          orders={allOrders}
          account={account}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      )}

      {!loading && view === "returns" && (
        <ReturnsList
          orders={allOrders}
          account={account}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
        />
      )}
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
  const t = useTranslations("account");
  const visible = orders.filter(
    (o) => !RETURN_STATUS_IDS.has(o.order?.orderStatusId ?? 0),
  );

  return (
    <div className="flex h-full flex-col gap-0 lg:max-h-[550px] lg:overflow-y-auto">
      {visible.length > 0 ? (
        <>
          {visible.map((order) => (
            <OrderItem key={order.order?.id} order={order} account={account} />
          ))}
          <AutoLoadMore
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
          />
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <UIText variant="uppercase">{t("no orders yet")}</UIText>
          <Button
            size={"lg"}
            variant="simpleReverseWithBorder"
            className="self-start uppercase"
            asChild
          >
            <Link href="/catalog">{t("explore collections")}</Link>
          </Button>
        </div>
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
  const t = useTranslations("account");
  const visible = orders.filter((o) =>
    RETURN_STATUS_IDS.has(o.order?.orderStatusId ?? 0),
  );

  return (
    <div className="flex max-h-[550px] flex-col gap-0 overflow-y-auto">
      {visible.length > 0 ? (
        <>
          {visible.map((order) => (
            <OrderItem key={order.order?.id} order={order} account={account} />
          ))}
          <AutoLoadMore
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
          />
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <UIText variant="uppercase">{t("no returns")}</UIText>
          <UIText>{t("to start new return, visit our returns")}</UIText>
        </div>
      )}
    </div>
  );
}

function AutoLoadMore({
  hasMore,
  loadingMore,
  onLoadMore,
}: Pick<ListProps, "hasMore" | "loadingMore" | "onLoadMore">) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loadingMore, onLoadMore]);

  if (!hasMore) return null;

  return !loadingMore ? <div ref={ref} /> : null;
}

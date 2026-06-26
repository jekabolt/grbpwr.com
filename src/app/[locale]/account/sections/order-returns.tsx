"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { common_OrderFull, StorefrontAccount } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text as UIText } from "@/components/ui/text";
import { SubmissionToaster } from "@/components/ui/toaster";

import { OrderItem } from "../_components/order-item";
import { OrderReturnsSectionFallback } from "../_components/section-fallbacks";
import { useOrders } from "../utils/use-orders";

const SECTION_CLASSNAME = "flex h-full min-h-0 w-full flex-col";
const LIST_CLASSNAME =
  "flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto  bg-bgColor pt-16 text-textColor";

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
  const {
    allOrders,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    toastOpen,
    toastMessage,
    setToastOpen,
  } = useOrders();

  return (
    <>
      <div className={SECTION_CLASSNAME}>
        <div className="flex shrink-0">
          {ORDER_RETURN_TABS.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => setView(tab.value)}
              className={cn("w-full uppercase", {
                "border-b border-textColor": view === tab.value,
                "border-b border-textInactiveColor": view !== tab.value,
              })}
            >
              {t(tab.labelKey)}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className={LIST_CLASSNAME}>
            <OrderReturnsSectionFallback />
          </div>
        ) : null}

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
      {toastMessage && (
        <SubmissionToaster
          open={toastOpen}
          message={toastMessage}
          onOpenChange={setToastOpen}
        />
      )}
    </>
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
  const showEmpty = visible.length === 0 && !hasMore;

  return (
    <div className={LIST_CLASSNAME}>
      {visible.map((order) => (
        <OrderItem key={order.order?.id} order={order} account={account} />
      ))}
      {visible.length === 0 && hasMore ? <OrderReturnsSectionFallback /> : null}
      {showEmpty ? (
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
      ) : null}
      <AutoLoadMore
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
      />
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
  const showEmpty = visible.length === 0 && !hasMore;

  return (
    <div className={LIST_CLASSNAME}>
      {visible.map((order) => (
        <OrderItem key={order.order?.id} order={order} account={account} />
      ))}
      {visible.length === 0 && hasMore ? <OrderReturnsSectionFallback /> : null}
      {showEmpty ? (
        <div className="flex flex-col gap-6">
          <UIText variant="uppercase">{t("no returns")}</UIText>
          <Button
            size={"lg"}
            variant="simpleReverseWithBorder"
            className="self-start uppercase"
            asChild
          >
            <Link href="/return">{t("start a return")}</Link>
          </Button>
        </div>
      ) : null}
      <AutoLoadMore
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
      />
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

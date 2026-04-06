"use client";

import { Suspense, useState } from "react";
import type { common_OrderFull } from "@/api/proto-http/frontend";

import { OrderPageComponent } from "./order-page";
import { OrderPageSkeleton } from "./order-page-skeleton";
import { OrderReviewPanel } from "./order-review-panel";
import { OrderReviewPanelSkeleton } from "./order-review-panel-skeleton";
import { OrderSectionNav, type OrderViewSection } from "./order-section-nav";

export function OrderExperienceClient({
  isDelivered,
  orderPromise,
  orderUuid,
  b64Email,
}: {
  isDelivered: boolean;
  orderPromise: Promise<{ order: common_OrderFull | undefined }>;
  orderUuid: string;
  b64Email: string;
}) {
  const [section, setSection] = useState<OrderViewSection>(() =>
    isDelivered ? "review" : "order",
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-10">
      <div className="shrink-0 space-y-2">
        <OrderSectionNav
          isDelivered={isDelivered}
          activeSection={section}
          onSectionChange={setSection}
        />
      </div>
      <div className="flex h-full min-h-0 flex-1 flex-col">
        {section === "order" && (
          <Suspense fallback={<OrderPageSkeleton />}>
            <OrderPageComponent orderPromise={orderPromise} />
          </Suspense>
        )}
        {section === "review" && (
          <Suspense fallback={<OrderReviewPanelSkeleton />}>
            <OrderReviewPanel
              orderUuid={orderUuid}
              b64Email={b64Email}
              orderPromise={orderPromise}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

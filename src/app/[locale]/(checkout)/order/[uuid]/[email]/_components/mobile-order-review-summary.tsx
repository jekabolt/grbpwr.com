"use client";

import { useState, type RefCallback } from "react";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";

import { OrderReviewProductRow } from "./order-review-product-row";

export type OrderItemReviewRow = {
  key: string;
  product: common_OrderItem;
  lineItemIndex: number;
};

type Props = {
  orderItemReviewRows: OrderItemReviewRow[];
  itemsTitle: string;
  disabled?: boolean;
  fitBlinkingIndices?: number[];
  itemsSectionOpen?: boolean;
  onItemsSectionOpenChange?: (open: boolean) => void;
  rowRef?: (lineItemIndex: number) => RefCallback<HTMLDivElement> | undefined;
};

export function MobileOrderReviewSummary({
  orderItemReviewRows,
  itemsTitle,
  disabled,
  fitBlinkingIndices = [],
  itemsSectionOpen,
  onItemsSectionOpenChange,
  rowRef,
}: Props) {
  const t = useTranslations("checkout");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(true);
  const controlled = itemsSectionOpen !== undefined;
  const isOpen = controlled ? itemsSectionOpen : uncontrolledOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (controlled) {
      onItemsSectionOpenChange?.(next);
    } else {
      setUncontrolledOpen(next);
    }
  };

  return (
    <FieldsGroupContainer
      signType="plus-minus"
      className="space-y-0 border border-textInactiveColor p-2.5"
      signPosition="before"
      title={`${isOpen ? t("hide") : t("show")} ${itemsTitle}`}
      isOpen={isOpen}
      onToggle={handleToggle}
    >
      <div className="mt-6 w-full space-y-3">
        {orderItemReviewRows.map((row) => (
          <OrderReviewProductRow
            key={row.key}
            product={row.product}
            itemIndex={row.lineItemIndex}
            disabled={disabled}
            shouldBlinkFit={fitBlinkingIndices.includes(row.lineItemIndex)}
            mobileSummaryFitSelect
            rowRef={rowRef?.(row.lineItemIndex)}
          />
        ))}
      </div>
    </FieldsGroupContainer>
  );
}

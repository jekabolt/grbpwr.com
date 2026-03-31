"use client";

import { useState } from "react";
import type {
  common_OrderFull,
  common_OrderItem,
} from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";

import { OrderReviewProductRow } from "./order-review-product-row";

export type MobileOrderReviewExpandedRow = {
  key: string;
  product: common_OrderItem;
  lineItemIndex: number;
};

type Props = {
  orderData: common_OrderFull;
  expandedReviewRows: MobileOrderReviewExpandedRow[];
  itemsTitle: string;
  disabled?: boolean;
};

export function MobileOrderReviewSummary({
  expandedReviewRows,
  disabled,
}: Props) {
  const t = useTranslations("checkout");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FieldsGroupContainer
      signType="plus-minus"
      className="space-y-0 border border-textInactiveColor p-2.5"
      signPosition="before"
      title={`${isOpen ? t("hide") : t("show")} ${t("order summary")}`}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
    >
      <div className="mt-6 w-full space-y-3">
        {expandedReviewRows.map((row) => (
          <OrderReviewProductRow
            key={row.key}
            product={row.product}
            itemIndex={row.lineItemIndex}
            disabled={disabled}
          />
        ))}
      </div>
    </FieldsGroupContainer>
  );
}

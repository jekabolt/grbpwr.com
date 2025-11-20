"use client";

import { useState } from "react";
import { common_OrderItem } from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";
import { OrderProducts } from "./order-products";

type Props = {
  validatedProducts?: common_OrderItem[];
};

export function MobileOrderSummary({ validatedProducts }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <FieldsGroupContainer
      styling={{
        sign: "plus-minus",
        signPosition: "before",
      }}
      title={`${isOpen ? "hide" : "show"} order summary`}
      preview={<Text>2450.00 USD</Text>}
      isOpen={isOpen}
      onToggle={handleToggle}
    >
      <OrderProducts validatedProducts={validatedProducts} />
    </FieldsGroupContainer>
  );
}

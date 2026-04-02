"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/ui/text";

type OrderIdDateRowProps = {
  orderUuid: string | undefined;
  placedAt: string | undefined;
  variant?: "desktop" | "mobile";
};

export function OrderIdDateRow({
  orderUuid,
  placedAt,
  variant = "desktop",
}: OrderIdDateRowProps) {
  const t = useTranslations("order-info");

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-baseline justify-between">
          <Text variant="uppercase">{t("order id")}</Text>
          <Text className="select-all break-all">{orderUuid}</Text>
        </div>
        <div className="flex w-full items-baseline justify-between">
          <Text variant="uppercase">{t("order date")}</Text>
          {placedAt && (
            <Text>{new Date(placedAt).toLocaleDateString()}</Text>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-y-6 border-b border-textInactiveColor pb-6">
      <div className="flex w-full flex-col items-baseline justify-between gap-4">
        <Text variant="uppercase">{t("order id")}</Text>
        <Text className="select-all break-all">{orderUuid}</Text>
      </div>
      <div className="flex w-full flex-col items-baseline justify-between gap-4">
        <Text variant="uppercase">{t("order date")}</Text>
        {placedAt && (
          <Text>{new Date(placedAt).toLocaleDateString()}</Text>
        )}
      </div>
    </div>
  );
}

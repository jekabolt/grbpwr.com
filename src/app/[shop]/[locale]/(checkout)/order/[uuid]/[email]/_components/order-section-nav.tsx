"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type OrderViewSection = "order" | "review";

export function OrderSectionNav({
  isDelivered,
  activeSection,
  onSectionChange,
}: {
  isDelivered: boolean;
  activeSection: OrderViewSection;
  onSectionChange: (section: OrderViewSection) => void;
}) {
  const t = useTranslations("order-info");

  return (
    <div className="flex flex-wrap items-baseline gap-6">
      <Button
        type="button"
        className={cn("uppercase !leading-none text-textInactiveColor", {
          "text-textColor underline": activeSection === "order",
          "order-2": isDelivered,
        })}
        onClick={() => onSectionChange("order")}
      >
        {t("order info")}
      </Button>
      <Button
        type="button"
        disabled={!isDelivered}
        className={cn("uppercase !leading-none text-textInactiveColor", {
          "text-textColor underline": activeSection === "review",
          "order-1": isDelivered,
        })}
        onClick={() => onSectionChange("review")}
      >
        {t("review order")}
      </Button>
    </div>
  );
}

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

  const tabBtn = (label: string, section: OrderViewSection) => {
    const isActive = activeSection === section;
    return (
      <Button
        type="button"
        tabIndex={isActive ? 0 : -1}
        className={cn("uppercase !leading-none text-textInactiveColor", {
          "text-textColor underline": isActive,
        })}
        onClick={() => onSectionChange(section)}
      >
        {label}
      </Button>
    );
  };

  const orderTab = tabBtn(t("order info"), "order");
  const reviewTab = tabBtn(t("review order"), "review");

  return (
    <div
      role="tablist"
      aria-label={t("order navigation")}
      className="flex flex-wrap items-baseline gap-6"
    >
      {isDelivered ? (
        <>
          {reviewTab}
          {orderTab}
        </>
      ) : (
        <>
          {orderTab}
          {reviewTab}
        </>
      )}
    </div>
  );
}

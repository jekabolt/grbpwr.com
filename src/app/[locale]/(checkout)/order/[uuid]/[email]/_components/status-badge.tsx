import { useTranslations } from "next-intl";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";



const getStatusKey = (statusId: number): string => {
  switch (statusId) {
    case 1:
      return "placed";
    case 2:
      return "awaiting payment";
    case 3:
      return "confirmed";
    case 4:
      return "shipped";
    case 5:
      return "delivered";
    case 6:
      return "cancelled";
    case 7:
      return "refunded";
    case 8:
      return "pending return";
    case 9:
      return "refund in progress";
    default:
      return "unknown";
  }
};

export function StatusBadge({ statusId }: { statusId: number }) {
  const t = useTranslations("order-info");
  const statusKey = getStatusKey(statusId);

  return (
    <Text variant="uppercase" className={cn("inline-block")}>
      {t(statusKey as any)}
    </Text>
  );
}

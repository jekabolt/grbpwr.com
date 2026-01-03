import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

const getStatusColor = (statusId: number) => {
  switch (statusId) {
    case 1:
      return "bg-blue-100 text-blue-800";
    case 2:
      return "bg-yellow-100 text-yellow-800";
    case 3:
      return "bg-green-100 text-green-800";
    case 4:
      return "bg-purple-100 text-purple-800";
    case 5:
      return "bg-emerald-100 text-emerald-800";
    case 6:
      return "bg-red-100 text-red-800";
    case 7:
      return "bg-gray-100 text-gray-800";
    case 8:
      return "bg-gray-100 text-gray-800";
    case 9:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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
  const color = getStatusColor(statusId);

  return (
    <Text variant="uppercase" className={cn("inline-block")}>
      {t(statusKey as any)}
    </Text>
  );
}

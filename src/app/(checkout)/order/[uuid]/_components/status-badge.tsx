import { cn } from "@/lib/utils";

const getStatusInfo = (statusId: number) => {
  switch (statusId) {
    case 1:
      return { text: "Placed", color: "bg-blue-100 text-blue-800" };
    case 2:
      return {
        text: "Awaiting Payment",
        color: "bg-yellow-100 text-yellow-800",
      };
    case 3:
      return { text: "Confirmed", color: "bg-green-100 text-green-800" };
    case 4:
      return { text: "Shipped", color: "bg-purple-100 text-purple-800" };
    case 5:
      return { text: "Delivered", color: "bg-emerald-100 text-emerald-800" };
    case 6:
      return { text: "Cancelled", color: "bg-red-100 text-red-800" };
    case 7:
      return { text: "Refunded", color: "bg-gray-100 text-gray-800" };
    default:
      return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
  }
};

export function StatusBadge({ statusId }: { statusId: number }) {
  const { text, color } = getStatusInfo(statusId);

  return <span className={cn("block p-2.5", color)}>{text}</span>;
}

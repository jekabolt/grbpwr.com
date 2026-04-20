import Link from "next/link";
import { common_OrderFull, StorefrontAccount } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { buildOrderConfirmationUrl } from "../../(checkout)/checkout/_components/new-order-form/utils";
import { StatusBadge } from "../../(checkout)/order/[uuid]/[email]/_components/status-badge";
import { formatOrderDate } from "../utils/utility";

export function OrderItem({
  order,
  account,
}: {
  order: common_OrderFull;
  account: StorefrontAccount;
}) {
  const { currentCountry, languageId } = useTranslationsStore((s) => s);
  const createdAt = formatOrderDate(
    order.order?.placed ??
      order.order?.modified ??
      order.orderReview?.orderReview?.createdAt,
  );

  return (
    <div className="border-b border-textInactiveColor py-6 first:pt-0">
      <Link
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-6"
        href={buildOrderConfirmationUrl({
          countryCode: currentCountry.countryCode,
          languageId,
          orderUuid: order.order?.uuid ?? "",
          emailBase64: window.btoa(account.email ?? ""),
        })}
      >
        <div className="min-w-0 space-y-6">
          <Text>{createdAt}</Text>
          <div>
            <Text>{order.order?.uuid}</Text>
            <StatusBadge statusId={order.order?.orderStatusId ?? 0} />
            <Button asChild variant="underlineWithColors" className="uppercase">
              <Link href={order.shipment?.trackingCode ?? ""}>track order</Link>
            </Button>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {order.orderItems?.slice(0, 3).map((i) => (
            <div key={i.id} className="w-20">
              <Image
                src={i.thumbnail ?? ""}
                fit="contain"
                aspectRatio="4/5"
                alt="product"
              />
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}

"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";

export function OrderAddressLines({
  buyer,
  addressSource,
}: {
  buyer: common_OrderFull["buyer"];
  addressSource: common_OrderFull["shipping"] | common_OrderFull["billing"];
}) {
  const addr = addressSource?.addressInsert;
  if (!addr) return null;

  return (
    <div>
      <Text>
        {`${buyer?.buyerInsert?.firstName ?? ""} ${buyer?.buyerInsert?.lastName ?? ""}`.trim()}
      </Text>
      <Text>{addr.addressLineOne}</Text>
      {addr.addressLineTwo && <Text>{addr.addressLineTwo}</Text>}
      <Text>{addr.city}</Text>
      <Text>{addr.postalCode}</Text>
    </div>
  );
}

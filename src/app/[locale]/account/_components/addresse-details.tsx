import {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";

import { getCountryName } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export function AddressFullDetails({
  address,
  account,
}: {
  address: StorefrontSavedAddress;
  account: StorefrontAccount;
}) {
  const fullName =
    `${account.firstName?.trim() ?? ""} ${account.lastName?.trim() ?? ""}`.trim();

  return (
    <div className="flex w-full flex-col leading-none">
      <div className="flex items-center justify-between gap-3">
        <Text className="truncate">
          {[address.addressLineOne, address.addressLineTwo]
            .filter(Boolean)
            .join(", ")}
        </Text>
        {address.isDefault ? (
          <Text variant="uppercase" className="shrink-0">
            default
          </Text>
        ) : null}
      </div>
      <Text className="truncate">
        {[
          getCountryName(address.country) ?? address.country,
          address.state,
          address.city,
          address.postalCode,
        ]
          .filter(Boolean)
          .join(", ")}
      </Text>
      {account.phone ? <Text>+{account.phone}</Text> : null}
      <Text variant="uppercase" className="truncate">
        {fullName || address.label || "address"}
      </Text>
    </div>
  );
}

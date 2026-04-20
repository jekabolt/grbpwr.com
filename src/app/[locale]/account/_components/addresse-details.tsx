import {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";

import {
  formatAddressDisplayName,
  formatAddressLocation,
  formatAddressStreet,
} from "../utils/address-format";

export function AddressFullDetails({
  address,
  account,
}: {
  address: StorefrontSavedAddress;
  account: StorefrontAccount;
}) {
  return (
    <div className="flex w-full flex-col leading-none">
      <div className="flex items-center justify-between gap-3">
        <Text className="truncate">{formatAddressStreet(address)}</Text>
        {address.isDefault ? (
          <Text variant="uppercase" className="shrink-0">
            default
          </Text>
        ) : null}
      </div>
      <Text className="truncate">{formatAddressLocation(address)}</Text>
      {account.phone ? <Text>+{account.phone}</Text> : null}
      <Text variant="uppercase" className="truncate">
        {formatAddressDisplayName(address, account)}
      </Text>
    </div>
  );
}

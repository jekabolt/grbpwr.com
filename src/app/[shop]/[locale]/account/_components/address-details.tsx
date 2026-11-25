import {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";

import { Text } from "@/components/ui/text";

import {
  formatAddressDisplayName,
  formatAddressLocation,
  formatAddressStreet,
  formatE164PhoneDisplay,
} from "../utils/address-format";

export function AddressFullDetails({
  address,
  account,
}: {
  address: StorefrontSavedAddress;
  account: StorefrontAccount;
}) {
  const phoneDisplay = formatE164PhoneDisplay(account.phone);

  return (
    <div className="flex flex-col leading-none">
      <div className="flex items-center justify-between gap-3">
        <Text className="truncate">{formatAddressStreet(address)}</Text>
      </div>
      <Text className="truncate">{formatAddressLocation(address)}</Text>
      {phoneDisplay ? <Text className="truncate">{phoneDisplay}</Text> : null}
      <Text variant="uppercase" className="truncate">
        {formatAddressDisplayName(address, account)}
      </Text>
    </div>
  );
}

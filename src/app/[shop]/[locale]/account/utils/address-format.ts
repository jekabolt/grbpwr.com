import type {
  StorefrontAccount,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";

import { getCountryName } from "@/lib/utils";

export function formatAddressStreet(address: StorefrontSavedAddress) {
  return [address.addressLineOne, address.addressLineTwo]
    .filter(Boolean)
    .join(", ");
}

export function formatAddressLocation(address: StorefrontSavedAddress) {
  return [
    getCountryName(address.country) ?? address.country,
    address.state,
    address.city,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function formatAddressDisplayName(
  address: StorefrontSavedAddress,
  account: StorefrontAccount,
) {
  const fullName =
    `${account.firstName?.trim() ?? ""} ${account.lastName?.trim() ?? ""}`.trim();
  return fullName || address.label || "address";
}

/** Avoids "++…" when the API already stores E.164 with a leading "+". */
export function formatE164PhoneDisplay(
  phone: string | undefined | null,
): string {
  const trimmed = String(phone ?? "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

export function buildAddressTextValue(address: StorefrontSavedAddress) {
  return [
    address.addressLineOne,
    address.addressLineTwo,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

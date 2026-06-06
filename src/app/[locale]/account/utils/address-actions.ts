import type { StorefrontSavedAddress } from "@/api/proto-http/frontend";

import { parseApiError } from "./api-error";
import { isSameCountry } from "./utility";

export async function setDefaultAddressRequest(
  id: number,
  fallbackMessage = "",
) {
  const response = await fetch(`/api/account/addresses/${id}/default`, {
    method: "POST",
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error: await parseApiError(response, fallbackMessage),
    };
  }

  return { ok: true as const };
}

export function promoteDefaultAddressForCountry(
  address: StorefrontSavedAddress,
  browsingCountryCode?: string,
  onDone?: () => void,
) {
  if (
    address.isDefault ||
    !isSameCountry(address.country, browsingCountryCode)
  ) {
    return;
  }

  const id = Number(address.id);
  if (!Number.isFinite(id)) return;

  void setDefaultAddressRequest(id)
    .catch(() => { })
    .finally(() => onDone?.());
}

type AddAddressPayload = {
  country: string;
  state?: string;
  city: string;
  addressLineOne: string;
  addressLineTwo?: string;
  company?: string;
  postalCode: string;
  phone?: string;
  isDefault?: boolean;
};

export async function addAddressRequest(
  address: AddAddressPayload,
  fallbackMessage: string,
) {
  const response = await fetch("/api/account/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error: await parseApiError(response, fallbackMessage),
    };
  }

  const data = (await response.json().catch(() => ({}))) as {
    address?: { id?: number | string };
  };

  const nextId = data.address?.id;
  return {
    ok: true as const,
    addressId:
      typeof nextId === "number" || typeof nextId === "string"
        ? String(nextId)
        : "",
  };
}

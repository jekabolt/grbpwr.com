import { parseApiError } from "./api-error";

export async function setDefaultAddressRequest(id: number) {
  const response = await fetch(`/api/account/addresses/${id}/default`, {
    method: "POST",
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error: await parseApiError(response, "failed to set default address"),
    };
  }

  return { ok: true as const };
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

export async function addAddressRequest(address: AddAddressPayload) {
  const response = await fetch("/api/account/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error: await parseApiError(response, "failed to add address"),
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

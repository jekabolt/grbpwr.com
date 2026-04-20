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

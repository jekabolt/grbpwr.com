import { parseApiError } from "@/app/[locale]/account/utils/api-error";

type ApiResult = {
  ok: boolean;
  error?: string;
};

export async function requestAccountLoginCode(
  email: string,
  fallbackMessage: string,
): Promise<ApiResult> {
  const response = await fetch("/api/account/login/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    return {
      ok: false,
      error: await parseApiError(response, fallbackMessage),
    };
  }

  return { ok: true };
}

export async function verifyAccountLoginCode(
  email: string,
  code: string,
  fallbackMessage: string,
): Promise<ApiResult> {
  const response = await fetch("/api/account/login/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    return {
      ok: false,
      error: await parseApiError(response, fallbackMessage),
    };
  }

  return { ok: true };
}

type MagicLinkTokenParams =
  | URLSearchParams
  | {
    token?: string;
    magic_token?: string;
    magicToken?: string;
  };

function getParam(
  params: MagicLinkTokenParams,
  key: "token" | "magic_token" | "magicToken",
): string | null | undefined {
  if (params instanceof URLSearchParams) return params.get(key);
  return params[key];
}

export function getMagicLinkToken(params: MagicLinkTokenParams): string {
  const token =
    getParam(params, "token") ??
    getParam(params, "magic_token") ??
    getParam(params, "magicToken") ??
    "";
  return token.trim();
}

export function getSafeRelativeRedirect(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  return raw;
}

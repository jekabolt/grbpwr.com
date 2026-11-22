// Per-shop revalidation secret (X18 design §5): the backend posts
// https://<shop host>/api/revalidate with HKDF-SHA256(SHOP_REVALIDATE_MASTER,
// info "revalidate:<shopKey>"), so one shop's secret never revalidates another.
// Pure module (WebCrypto only): runs in route handlers and the node test runner.

export const REVALIDATE_INFO_PREFIX = "revalidate:";

const enc = new TextEncoder();

/** Hex HKDF-SHA256 (empty salt, 32 bytes) of the master for one shop key. */
export async function deriveShopRevalidateSecret(
  master: string,
  shopKey: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(master),
    "HKDF",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),
      info: enc.encode(REVALIDATE_INFO_PREFIX + shopKey),
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

/** Constant-time string comparison (length leak only). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

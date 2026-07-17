// Public-URL tail parsers, mirroring the backend source of truth
// `internal/slug/slug.go` (ParseProductTail / ParseArchiveTail). The "pretty"
// segment is decorative; the resolve key is the trailing token — base SKU for a
// product, code for an archive — which we extract and hand to GetColorway /
// GetArchive. Do NOT ad-hoc split elsewhere: the pretty segment can itself contain
// hyphens and SKU-like fragments, so the width/format rules below matter.

export const BASE_SKU_LENGTH = 14;

// SS26-00021-BLK — season(2)+year(2) "-" model(5) "-" colour(3). Matches the
// productTokenRe CHECK in the backend.
const PRODUCT_TOKEN_RE = /^(?:SS|FW|PF|RC)[0-9]{2}-[0-9]{5}-[A-Z0-9]{3}$/;
// AR000C — 'AR' + 1..10 base36 upper. Matches archiveTokenRe / chk_archive_code_format.
const ARCHIVE_TOKEN_RE = /^AR[0-9A-Z]{1,10}$/;

// baseSkuFromHandle parses "/p/{pretty-}{base_sku}"'s handle segment and returns the
// resolve key, or null when the tail is not a valid base SKU. The base SKU is the
// trailing 14 chars; the backend resolves case-insensitively and the canonical URL
// is lowercase, so we return it lowercased.
export function baseSkuFromHandle(handle: string | undefined): string | null {
  const rest = (handle || "").trim();
  if (rest.length < BASE_SKU_LENGTH) return null;
  const token = rest.slice(-BASE_SKU_LENGTH).toUpperCase();
  if (!PRODUCT_TOKEN_RE.test(token)) return null;
  return token.toLowerCase();
}

// archiveCodeFromHandle parses "/timeline/{pretty-}{code}"'s handle segment and
// returns the upper-case archive code (the resolve key), or null when the tail is
// not a valid code. The code is the token after the last hyphen; the pretty prefix,
// if present, is ignored here (the backend validates it for canonicalisation).
export function archiveCodeFromHandle(
  handle: string | undefined,
): string | null {
  const rest = (handle || "").trim();
  const dash = rest.lastIndexOf("-");
  const token = (dash >= 0 ? rest.slice(dash + 1) : rest).toUpperCase();
  if (!ARCHIVE_TOKEN_RE.test(token)) return null;
  return token;
}

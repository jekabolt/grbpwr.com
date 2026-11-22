// Per-shop markdown pages (legal, FAQ, tier privileges). lekalo-shop serves no
// brand's own texts from /public: each shop's markdown comes in its profile
// (`legal` map, keys like "privacy-policy" or "privacy-policy.de"). A legal
// page or FAQ the shop has not written falls back to its legal identity.
// Pure module: no React, so the node test runner can check it.

export type ShopContentBrand = {
  legalName: string;
  address?: string;
  email?: string;
  legal?: Record<string, string>;
};

/** Markdown for `key` in `locale`, falling back to the shop's default text. */
export function shopMarkdown(
  legal: Record<string, string> | undefined,
  key: string,
  locale: string,
): string | undefined {
  if (!legal) return undefined;
  return legal[`${key}.${locale}`] ?? legal[key];
}

/** Minimal legal identity block (name, address, contact) — never another brand's text. */
export function shopIdentityMarkdown(brand: ShopContentBrand): string {
  return [`## ${brand.legalName}`, brand.address, brand.email]
    .filter(Boolean)
    .join("\n\n");
}

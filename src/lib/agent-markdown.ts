// Markdown representation of the site served to AI agents that request
// `Accept: text/markdown` (Markdown for Agents / content negotiation).
// Kept intentionally small and link-focused so it stays accurate.
// One deployment serves many shops, so links are built from the request host;
// the grbpwr pack keeps its own title and canonical origin.
import { GRBPWR_SITE } from "../brands/grbpwr/config.ts";
import type { ShopPack } from "../brands/index.ts";

/** Markdown overview returned for the homepage under text/markdown negotiation. */
export function homepageMarkdown(host: string, pack?: ShopPack): string {
  const site = pack ? GRBPWR_SITE.origin : `https://${host}`;
  const title = pack ? GRBPWR_SITE.brandName : host;
  const intro = pack
    ? `Online store and archive for ${GRBPWR_SITE.brandName}.`
    : "Online store and archive.";
  return `# ${title}

${intro}

## Sections

- [Shop / Catalog](${site}/gb/en/catalog)
- [Timeline / Archive](${site}/gb/en/timeline)
- [FAQ](${site}/gb/en/faq)
- [Client services](${site}/gb/en/client-services)
- [Aftersale services](${site}/gb/en/aftersale-services)
- [Returns](${site}/gb/en/return)
- [Legal notices](${site}/gb/en/legal-notices)

## Discovery

- Sitemap: ${site}/sitemap.xml

> Localized routes follow the pattern \`/{country}/{language}/…\` (e.g. \`/us/en\`, \`/fr/fr\`).
`;
}

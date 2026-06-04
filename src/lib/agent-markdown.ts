// Markdown representation of the site served to AI agents that request
// `Accept: text/markdown` (Markdown for Agents / content negotiation).
// Kept intentionally small and link-focused so it stays accurate.

export const SITE_URL = "https://grbpwr.com";

/** Markdown overview returned for the homepage under text/markdown negotiation. */
export function homepageMarkdown(): string {
  return `# GRBPWR

Online store and archive for GRBPWR.

## Sections

- [Shop / Catalog](${SITE_URL}/gb/en/catalog)
- [Timeline / Archive](${SITE_URL}/gb/en/timeline)
- [FAQ](${SITE_URL}/gb/en/faq)
- [Client services](${SITE_URL}/gb/en/client-services)
- [Aftersale services](${SITE_URL}/gb/en/aftersale-services)
- [Returns](${SITE_URL}/gb/en/return)
- [Legal notices](${SITE_URL}/gb/en/legal-notices)

## Discovery

- Sitemap: ${SITE_URL}/sitemap.xml

> Localized routes follow the pattern \`/{country}/{language}/…\` (e.g. \`/us/en\`, \`/fr/fr\`).
`;
}

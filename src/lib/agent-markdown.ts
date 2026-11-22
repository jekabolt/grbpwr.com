// Markdown representation of the site served to AI agents that request
// `Accept: text/markdown` (Markdown for Agents / content negotiation).
// Kept intentionally small and link-focused so it stays accurate.
// lekalo-shop: one deployment serves many shops, so links are built from the
// request host; no brand is hard-coded here.

/** Markdown overview returned for the homepage under text/markdown negotiation. */
export function homepageMarkdown(host: string): string {
  const site = `https://${host}`;
  return `# ${host}

Online store and archive.

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

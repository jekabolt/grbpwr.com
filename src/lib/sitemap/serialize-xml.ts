import type { MetadataRoute } from "next";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Root `<sitemapindex>` pointing at child sitemaps (Shopify-style). */
export function serializeSitemapIndex(childLocs: string[]): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  const lastmod = new Date().toISOString();
  for (const loc of childLocs) {
    lines.push("<sitemap>");
    lines.push(`<loc>${escapeXml(loc)}</loc>`);
    lines.push(`<lastmod>${lastmod}</lastmod>`);
    lines.push("</sitemap>");
  }
  lines.push("</sitemapindex>");
  return lines.join("\n");
}

/** Standard `<urlset>` (same shape as Next `MetadataRoute.Sitemap`). */
export function serializeUrlset(entries: MetadataRoute.Sitemap): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const item of entries) {
    xml += "<url>\n";
    xml += `<loc>${escapeXml(item.url)}</loc>\n`;
    if (item.lastModified) {
      const d = item.lastModified instanceof Date ? item.lastModified : new Date(item.lastModified);
      xml += `<lastmod>${d.toISOString()}</lastmod>\n`;
    }
    if (item.changeFrequency) {
      xml += `<changefreq>${item.changeFrequency}</changefreq>\n`;
    }
    if (typeof item.priority === "number") {
      xml += `<priority>${item.priority}</priority>\n`;
    }
    xml += "</url>\n";
  }

  xml += "</urlset>\n";
  return xml;
}

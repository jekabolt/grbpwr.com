import type { MetadataRoute } from "next";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** One `<url>` row; optional `<image:image>` (Google image extension). */
export type SitemapUrlEntry = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: NonNullable<MetadataRoute.Sitemap[number]>["changeFrequency"];
  priority?: number;
  images?: { loc: string; title?: string; caption?: string }[];
};

/** Root `<sitemapindex>` pointing at child sitemaps. */
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

export function serializeUrlset(entries: SitemapUrlEntry[]): string {
  const hasImages = entries.some((e) => e.images && e.images.length > 0);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  if (hasImages) {
    xml +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  } else {
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  }

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
    if (item.images?.length) {
      for (const img of item.images) {
        xml += "<image:image>\n";
        xml += `<image:loc>${escapeXml(img.loc)}</image:loc>\n`;
        if (img.title) xml += `<image:title>${escapeXml(img.title)}</image:title>\n`;
        if (img.caption) xml += `<image:caption>${escapeXml(img.caption)}</image:caption>\n`;
        xml += "</image:image>\n";
      }
    }
    xml += "</url>\n";
  }

  xml += "</urlset>\n";
  return xml;
}

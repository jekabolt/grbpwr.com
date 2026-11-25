import type { Metadata } from "next";

// Utility / legal content pages (faq, legal-notices, client-services,
// aftersale-services, return, order-status, unsubscribe) should not surface in
// search results or Google sitelinks. noindex removes them from the index while
// follow keeps link equity flowing. These pages are intentionally absent from
// the sitemap for the same reason.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

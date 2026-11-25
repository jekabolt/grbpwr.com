import { setRequestShopFrom } from "@/lib/shop/request-host";

// `[shop]` is the request host, put in front of every page path by the
// middleware, so ISR caches each page per shop. Nothing is prerendered at build
// time (no host then); each host/page is rendered on first visit and cached.
export function generateStaticParams() {
  return [];
}

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shop: string }>;
}) {
  await setRequestShopFrom(params);
  return children;
}

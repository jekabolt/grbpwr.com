import { shopIdentityMarkdown, shopMarkdown } from "@/lib/shop/content";
import { useShopBrand } from "@/components/contexts/ShopContext";

export interface MarkdownContentHook {
  content: string;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * lekalo-shop: markdown of the shop on this host, from its profile (no fetch,
 * no brand texts in /public). `fallback: "identity"` shows the shop's legal
 * name / address / email when the shop has not written this page.
 */
export const useMarkdownContent = (
  key: string | undefined,
  locale: string,
  fallback: "identity" | "none" = "identity",
): MarkdownContentHook => {
  const brand = useShopBrand();
  const own = key ? shopMarkdown(brand.legal, key, locale) : undefined;
  const content =
    own ?? (key && fallback === "identity" ? shopIdentityMarkdown(brand) : "");
  return { content, loading: false, error: null, retry: () => {} };
};

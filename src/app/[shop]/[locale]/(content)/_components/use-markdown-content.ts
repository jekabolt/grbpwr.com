import { useEffect, useState } from "react";
import { GRBPWR_PACK, grbpwrMarkdownPaths } from "@/brands/grbpwr/config";

import { shopIdentityMarkdown, shopMarkdown } from "@/lib/shop/content";
import { useShopBrand } from "@/components/contexts/ShopContext";

export interface MarkdownContentHook {
  content: string;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Markdown of the shop on this host: its profile `legal` text first; for the
 * grbpwr pack, then the pack's own files (fetched, first candidate that loads);
 * otherwise, with `fallback: "identity"`, the shop's legal name / address /
 * email. No shop ever gets another shop's text.
 */
export const useMarkdownContent = (
  key: string | undefined,
  locale: string,
  fallback: "identity" | "none" = "identity",
): MarkdownContentHook => {
  const brand = useShopBrand();
  const own = key ? shopMarkdown(brand.legal, key, locale) : undefined;
  const candidates =
    own === undefined && key && brand.pack === GRBPWR_PACK
      ? grbpwrMarkdownPaths(key, locale)
      : [];
  const candidatesKey = candidates.join("\0");

  const [fetched, setFetched] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(candidates.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    const paths = candidatesKey ? candidatesKey.split("\0") : [];
    if (paths.length === 0) {
      setFetched("");
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setFetched("");
      let lastError: string | null = null;
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (!response.ok) {
            lastError = `Failed to fetch content: ${response.status}`;
            continue;
          }
          const text = await response.text();
          if (cancelled) return;
          setFetched(text);
          setLoading(false);
          return;
        } catch (err) {
          lastError =
            err instanceof Error ? err.message : "Unknown error occurred";
        }
      }
      if (cancelled) return;
      setError(lastError || "Unable to load content from provided paths");
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [candidatesKey, reloadKey]);

  const retry = () => setReloadKey((k) => k + 1);
  if (own !== undefined) {
    return { content: own, loading: false, error: null, retry };
  }
  if (candidates.length > 0) {
    return { content: fetched, loading, error, retry };
  }
  const content =
    key && fallback === "identity" ? shopIdentityMarkdown(brand) : "";
  return { content, loading: false, error: null, retry };
};

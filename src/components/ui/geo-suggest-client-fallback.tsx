"use client";

import { useEffect, useState } from "react";

import { GeoSuggestBanner } from "./geo-suggest-banner";

function parseSuggestCookies(): {
  suggestCountry: string;
  suggestLocale: string;
  currentCountry: string;
} | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").reduce(
    (acc, s) => {
      const [k, v] = s.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    },
    {} as Record<string, string>,
  );
  const suggestCountry = cookies["NEXT_SUGGEST_COUNTRY"];
  const suggestLocale = cookies["NEXT_SUGGEST_LOCALE"];
  const currentCountry = cookies["NEXT_SUGGEST_CURRENT_COUNTRY"];
  if (!suggestCountry || !suggestLocale) return null;
  return {
    suggestCountry,
    suggestLocale,
    currentCountry: currentCountry ?? "",
  };
}

/**
 * Client fallback when server doesn't receive x-geo-suggest-* headers
 * (e.g. Vercel edge, static cache). Reads suggest cookies set by middleware.
 */
export function GeoSuggestClientFallback() {
  const [data, setData] =
    useState<ReturnType<typeof parseSuggestCookies>>(null);

  useEffect(() => {
    setData(parseSuggestCookies());
  }, []);

  if (!data) return null;

  return (
    <GeoSuggestBanner
      suggestCountry={data.suggestCountry}
      suggestLocale={data.suggestLocale}
      currentCountry={data.currentCountry || undefined}
    />
  );
}

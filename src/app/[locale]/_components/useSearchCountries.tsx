"use client";

import { useState } from "react";
import { COUNTRIES_BY_REGION } from "@/constants";

export function useSearchCountries() {
  const [query, setQuery] = useState("");

  function normalize(v?: string) {
    return (v ?? "").toString().toLocaleLowerCase().trim();
  }

  const searchQuery = normalize(query);

  const filteredCountries = !searchQuery
    ? []
    : Object.values(COUNTRIES_BY_REGION)
        .flat()
        .filter((c) => {
          const fields = [
            c.name,
            c.currency,
            c.currencyKey,
            c.countryCode,
            c.displayLng,
            c.lng,
          ]
            .filter(Boolean)
            .map(normalize);
          return fields.some((f) => f.includes(searchQuery));
        });

  function handleSearch(query: string) {
    setQuery(query);
  }

  return {
    query,
    searchQuery,
    filteredCountries,
    handleSearch,
  };
}

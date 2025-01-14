"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useFilterQueryParams(filterName: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilterChange(term?: string, additionalParams?: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(filterName, term);
    } else {
      params.delete(filterName);
    }

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
    }

    replace(`${pathname}?${params.toString()}`);
  }

  const defaultValue = searchParams.get(filterName)?.toString();

  return { defaultValue, handleFilterChange };
}

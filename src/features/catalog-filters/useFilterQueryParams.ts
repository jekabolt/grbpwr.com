"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function useFilterQueryParams(filterName: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleFilterChange(term?: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(filterName, term);
    } else {
      params.delete(filterName);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const defaultValue = searchParams.get(filterName)?.toString();

  return { defaultValue, handleFilterChange };
}

"use client";

import { common_Dictionary } from "@/api/proto-http/frontend";
import { useDataContext } from "@/components/contexts/DataContext";
import { getTopCategoryId, getTopCategoryNameForUrl } from "@/lib/categories-map";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function getDefaultValue({
  filterName,
  pathname,
  searchParams,
  dictionary,
}: {
  filterName: string;
  pathname: string;
  searchParams: URLSearchParams;
  dictionary: common_Dictionary | undefined;
}) {
  const segments = getPathSegments(pathname);

  if (segments[0] !== "catalog" || segments.length < 2) {
    return searchParams.get(filterName)?.toString();
  }

  if (filterName === "topCategoryIds" && segments.length >= 3) {
    const categoryId = getTopCategoryId(dictionary, segments[2]);
    return categoryId?.toString();
  }

  if (filterName === "gender") {
    const genderMap: Record<string, string> = {
      men: "GENDER_ENUM_MALE",
      women: "GENDER_ENUM_FEMALE",
      unisex: "GENDER_ENUM_UNISEX",
    };
    return genderMap[segments[1]] || segments[1];
  }

  return searchParams.get(filterName)?.toString();
}

export default function useFilterQueryParams(filterName: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { dictionary } = useDataContext();

  const handleTopCategoryNavigation = (term: string) => {
    const [, gender] = getPathSegments(pathname);
    const categoryUrlName = getTopCategoryNameForUrl(
      dictionary?.categories || [],
      parseInt(term)
    );
    if (categoryUrlName) {
      replace(`/catalog/${gender}/${categoryUrlName}`);
      return true;
    }
    return false;
  };

  function handleFilterChange(
    term?: string,
    additionalParams?: Record<string, string>
  ) {
    if (filterName === "topCategoryIds" && term) {
      const segments = getPathSegments(pathname);
      if (segments[0] === "catalog" && segments.length >= 2) {
        if (handleTopCategoryNavigation(term)) return;
      }
    }

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(filterName, term);
    } else {
      params.delete(filterName);
    }

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        value ? params.set(key, value) : params.delete(key);
      });
    }

    replace(`${pathname}?${params.toString()}`);
  }

  const defaultValue = getDefaultValue({
    filterName,
    pathname,
    searchParams,
    dictionary,
  });

  return { defaultValue, handleFilterChange };
}

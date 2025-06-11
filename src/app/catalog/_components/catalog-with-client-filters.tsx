"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { common_GenderEnum, common_Product } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";

import { HeroArchive } from "../../_components/hero-archive";
import Catalog from "./catalog";
import { MobileCatalog } from "./mobile-catalog";
import { NextCategoryButton } from "./next-category-button";

interface CatalogWithClientFiltersProps {
  initialProducts: common_Product[];
  initialTotal: number;
  hero?: any; // Add proper type based on your hero structure
}

export default function CatalogWithClientFilters({
  initialProducts,
  initialTotal,
  hero,
}: CatalogWithClientFiltersProps) {
  const searchParams = useSearchParams();

  const { filteredProducts, filteredTotal } = useMemo(() => {
    let filtered = [...initialProducts];

    // Get filter parameters
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const sale = searchParams.get("sale");
    const tag = searchParams.get("tag");
    const topCategoryIds = searchParams.get("topCategoryIds");
    const subCategoryIds = searchParams.get("subCategoryIds");

    // Apply filters based on productDisplay.productBody
    if (category) {
      filtered = filtered.filter((product) => {
        const categoryName = product.productDisplay?.productBody?.name;
        return categoryName?.toLowerCase().includes(category.toLowerCase());
      });
    }

    if (gender) {
      filtered = filtered.filter((product) => {
        const productGender = product.productDisplay?.productBody?.targetGender;
        return productGender === (gender.toUpperCase() as common_GenderEnum);
      });
    }

    if (sale === "true") {
      filtered = filtered.filter((product) => {
        const salePercentage =
          product.productDisplay?.productBody?.salePercentage?.value;
        return salePercentage && parseFloat(salePercentage) > 0;
      });
    }

    if (topCategoryIds) {
      const ids = topCategoryIds.split(",").map((id) => parseInt(id));
      filtered = filtered.filter((product) => {
        const topCategoryId =
          product.productDisplay?.productBody?.topCategoryId;
        return topCategoryId && ids.includes(topCategoryId);
      });
    }

    if (subCategoryIds) {
      const ids = subCategoryIds.split(",").map((id) => parseInt(id));
      filtered = filtered.filter((product) => {
        const subCategoryId =
          product.productDisplay?.productBody?.subCategoryId;
        return subCategoryId && ids.includes(subCategoryId);
      });
    }

    // Apply sorting if needed
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");

    if (sort) {
      filtered.sort((a, b) => {
        let aValue: string | number | Date = "";
        let bValue: string | number | Date = "";

        switch (sort) {
          case "price":
            aValue = parseFloat(
              a.productDisplay?.productBody?.price?.value || "0",
            );
            bValue = parseFloat(
              b.productDisplay?.productBody?.price?.value || "0",
            );
            break;
          case "name":
            aValue = a.productDisplay?.productBody?.name || "";
            bValue = b.productDisplay?.productBody?.name || "";
            break;
          case "created":
            aValue = new Date(a.createdAt || 0);
            bValue = new Date(b.createdAt || 0);
            break;
          default:
            return 0;
        }

        if (order === "desc") {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return {
      filteredProducts: filtered,
      filteredTotal: filtered.length,
    };
  }, [initialProducts, searchParams]);

  return (
    <>
      <div className="block lg:hidden">
        <MobileCatalog
          firstPageItems={filteredProducts}
          total={filteredTotal}
        />
      </div>
      <div className="hidden lg:block">
        <Catalog total={filteredTotal} firstPageItems={filteredProducts} />
      </div>
      <div
        className={cn("block", {
          hidden: !filteredTotal,
        })}
      >
        <div className="flex justify-center pb-5 pt-16">
          <NextCategoryButton />
        </div>
        <div>
          {hero?.entities
            ?.filter((e: any) => e.type === "HERO_TYPE_FEATURED_ARCHIVE")
            .map((e: any, i: number) => (
              <HeroArchive
                entity={e}
                key={i}
                className="space-y-12 pb-40 pt-14 lg:py-32"
              />
            ))}
        </div>
      </div>
    </>
  );
}

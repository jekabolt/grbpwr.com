"use client";

import { useEffect, useState } from "react";
import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import NavigationLayout from "@/components/navigation-layout";
import { MobileCatalog } from "@/app/catalog/_components/mobile-catalog";

import Filters from "./_components/catalog-filters";
import { InfinityScrollCatalog } from "./_components/infinity-scroll-catalog";
import { getProductsPagedQueryParams } from "./_components/utils";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    order?: string;
    sort?: string;
    size?: string;
  }>;
}

export default function CatalogPage(props: CatalogPageProps) {
  const [hideFooter, setHideFooter] = useState(true);
  const [catalogData, setCatalogData] = useState<{
    products: any[];
    total: number;
  }>({ products: [], total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await serviceClient.GetProductsPaged({
        limit: CATALOG_LIMIT,
        offset: 0,
        ...getProductsPagedQueryParams(await props.searchParams),
      });
      setCatalogData({
        products: response.products || [],
        total: response.total || 0,
      });
    };

    fetchData();
  }, [props.searchParams]);

  return (
    <NavigationLayout hideForm={hideFooter}>
      <div className="block lg:hidden">
        <MobileCatalog
          firstPageItems={catalogData.products || []}
          total={catalogData.total || 0}
          setAllLoaded={(loaded) => setHideFooter(!loaded)}
        />
      </div>
      <div className="hidden space-y-10 px-7 py-20 lg:block">
        <Filters />
        <InfinityScrollCatalog
          total={catalogData.total || 0}
          firstPageItems={catalogData.products || []}
          setAllLoaded={(loaded) => setHideFooter(!loaded)}
        />
      </div>
    </NavigationLayout>
  );
}

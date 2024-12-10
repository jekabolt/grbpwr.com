import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import NavigationLayout from "@/components/navigation-layout";

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

export default async function CatalogPage(props: CatalogPageProps) {
  const searchParams = await props.searchParams;
  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams(searchParams),
  });

  return (
    <NavigationLayout>
      <div>
        <Filters />
        <InfinityScrollCatalog
          total={response.total || 0}
          firstPageItems={response.products || []}
        />
      </div>
    </NavigationLayout>
  );
}

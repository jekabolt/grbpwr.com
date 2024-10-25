import {InfinityScrollCatalog} from "@/features/infinity-scroll-catalog";
import Filters from "@/features/catalog-filters";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import { CATALOG_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";
import { getProductsPagedQueryParams } from "@/features/catalog-filters/utils";

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

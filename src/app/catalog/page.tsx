import CatalogSection from "@/components/sections/CatalogSection";
import Filters from "@/components/sections/Filters";
import CoreLayout from "@/components/layouts/CoreLayout";
import { CATALOG_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";
import { getValidatedGetProductsPagedParams } from "@/lib/utils/queryFilters";

interface CatalogPageProps {
  searchParams: {
    category?: string;
    gender?: string;
    order?: string;
    sort?: string;
    size?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getValidatedGetProductsPagedParams(searchParams),
  });

  return (
    <CoreLayout>
      <div>
        <Filters />
        <CatalogSection
          total={response.total || 0}
          firstPageItems={response.products || []}
        />
      </div>
    </CoreLayout>
  );
}

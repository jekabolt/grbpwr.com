import CatalogSection from "@/components/sections/CatalogSection";
import Filters from "@/components/Filters";
import CoreLayout from "@/components/layouts/CoreLayout";
import { CATALOG_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";

export default async function Page() {
  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    sortFactors: undefined,
    orderFactor: undefined,
    filterConditions: undefined,
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

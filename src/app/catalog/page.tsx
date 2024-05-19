import Catalog from "@/components/Catalog";
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
        <Catalog firstPageItems={response.products || []} />
      </div>
    </CoreLayout>
  );
}

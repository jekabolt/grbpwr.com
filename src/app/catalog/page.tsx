import Catalog from "@/components/Catalog";
import Link from "@/components/global/Link";
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
        <div className="flex w-full justify-between pb-8 pt-4">
          <div className="flex gap-2">
            <button className="underline">a11</button>
            {" / "}
            <button>man</button>
            {" / "}
            <button>women</button>
          </div>

          <div className="flex gap-8 lg:gap-24">
            <div>
              sort by <span className="underline">latest arrival</span>
            </div>
            <div>filter {"+"}</div>
          </div>
        </div>
        <Catalog firstPageItems={response.products || []} />
      </div>
    </CoreLayout>
  );
}
